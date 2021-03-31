import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { State } from 'src/app/store/node-store/node.reducer';
import { Node, NodeMap } from '../../models/dto/node';
import * as d3 from 'd3';
import * as Utils from 'src/app/d3/d3.graph.utils';
import { GraphNode } from 'src/app/d3/models/graph';
import {
  DELETE_NODE_CONFIRMATION,
  confirmationDialogConfig,
  CONNECT_TO_SELF_WARNING_MESSAGE
} from 'src/app/constants';
import { AlertType } from 'src/app/models/enums/alert-type';
import {
  ConfirmationDialogComponent,
  DialogData,
} from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  create,
  createRelationship,
  removeRelationship,
} from 'src/app/store/node-store/node.actions';
import { AlertService } from 'src/app/services/alert.service';
import panzoom, { PanZoom } from "panzoom";
import { UserProfileFacade } from 'src/app/store/user-profile-store/userprofile.facade';
import { NodeComment } from 'src/app/models/dto/node-comment';

let pressedBlock = '';
let showFreeFormIcon = true;
let sourceNodeContext: Node;
let destNodeContext: Node;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit, OnChanges {

  private readonly zoomLevels = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

  public showEditor = false;
  public currentNode: Node;
  public top = 0;
  public left = 0;
  public currentZoomLevel = this.zoomLevels[4];

  private panZoomController: PanZoom;
  private loggedinUserDisplayName: string;
  private gNode: GraphNode;
  private readonly DOWN_FREE_IMG_SPACING = 50;
  private readonly DEFAULT_ACTION_BUTTON_OFFSET = 97;

  @Input() guidelineId: number;
  @Input() guidelineVersionId: number;
  @Input() nodeMap: NodeMap;
  @Input() startingPointNodeIds: any;
  @Input() isPreviewMode: boolean;
  @Input() isReviewMode: boolean;
  @Input() shouldShowComments: boolean;
  @Input() nodeCommentMap: Map<number, number[]>;

  @Output() onSetExpandedNodeComments: EventEmitter<number[]> = new EventEmitter();

  // Zoom in and out props
  @ViewChild('scene', { static: false }) scene: ElementRef;
  @ViewChild('svg') svgRef: ElementRef<SVGElement>;

  constructor(
    public renderer: Renderer2,
    public dialog: MatDialog,
    private store: Store<State>,
    private _alertService: AlertService,
    private _userProfileFacade: UserProfileFacade
  ) {}

  ngAfterViewInit(): void {
    this._userProfileFacade
      .userDisplayName$
      .pipe(take(1))
      .subscribe((displayName) => {
        this.loggedinUserDisplayName = displayName;
      });
    this.renderTree();
    this.configureZoom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const isPreviewModeChanged = changes.isPreviewMode &&
      changes.isPreviewMode.previousValue !== undefined &&
      changes.isPreviewMode.previousValue !== changes.isPreviewMode.currentValue;
    const isReviewModeChanged = changes.isReviewMode &&
      changes.isReviewMode.previousValue !== undefined &&
      changes.isReviewMode.previousValue !== changes.isReviewMode.currentValue;
    if (
      (isPreviewModeChanged) || (isReviewModeChanged) || (changes.nodeCommentMap && changes.nodeCommentMap.previousValue && changes.nodeCommentMap.isFirstChange) ||
      (changes.nodeMap &&
      changes.nodeMap.previousValue &&
      changes.nodeMap.previousValue.nodes !== changes.nodeMap.currentValue.nodes)
    ) {
      this.rerenderTree();
    }
  }

  public openDeleteDialog(parentId: number, childId: number): void {
    const data: DialogData = {
      title: 'Delete Confirmation',
      content: DELETE_NODE_CONFIRMATION,
      type: AlertType.Warning,
      acceptText: 'Confirm',
      declineText: 'Cancel',
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...confirmationDialogConfig,
      data,
      panelClass: 'confirmation-dialog',
    });

    dialogRef
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.delete(parentId, childId);
        }
      });
  }

  // Zoom in and Out
 public zoomToggle(zoomIn: boolean) {
    const idx = this.zoomLevels.indexOf(this.currentZoomLevel);
    if (zoomIn && this.zoomLevels.length > (idx + 1)) {
      this.currentZoomLevel = this.zoomLevels[idx + 1];
    } else if (!zoomIn && idx >= 1) {
      this.currentZoomLevel = this.zoomLevels[idx - 1];
    }   

    this.panZoomController.moveTo(0, 0);
    this.panZoomController.zoomAbs(0, 0, this.currentZoomLevel*2);
  }

  public zoomfit() {
    this.currentZoomLevel = 0.5;
    this.panZoomController.moveTo(0, 0);
    this.panZoomController.zoomAbs(0, 0, 1);
  }

  public toggleTextEditor(): void {
    this.showEditor = !this.showEditor;
    if (!this.showEditor) {
      setTimeout(() => {
        this.rerenderTree();

      }, 0);
    }
  }

  private configureZoom(): void {
    this.panZoomController = panzoom(this.scene.nativeElement, {
      beforeWheel: function(e) {
        // allow wheel-zoom only if altKey is down. Otherwise - ignore
        let shouldIgnore = !e.altKey;
        return shouldIgnore;
      },    
      zoomDoubleClickSpeed: 1, 
      
      beforeMouseDown: function(e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        // var shouldIgnore = !e.ctrlKey; --- 
        return true;
      },
    });
  }

  private rerenderTree(): void {
    Utils.clearTree();
    this.renderTree();

    const sidenavEl = document.querySelector('mat-sidenav-content');
    if (sidenavEl) {
      sidenavEl.scrollLeft = this.left;
      sidenavEl.scrollTop = this.top;
    }
  }

  private renderTree(): void {
    const rootGraphNodes: GraphNode[] = Utils.mapToGraphNodes(this.nodeMap);
    const rootNode = this.createVirtualRoot(
      this.createVirtualNode(),
      this.createAddParentNode(),
      rootGraphNodes
    );

    this.createGraphNode(
      this.svgRef,
      rootGraphNodes,
      rootNode,
      this.nodeMap
    );
  }

  private createVirtualNode(): Node {
    return {
      id: 0,
      parentId: 0,
      version: 0,
      content: null,
      outgoingNodes: null,
      footnotes: null,
      section: null,
      index: 0,
      guidelineId: null,
    };
  }

  private createAddParentNode(): Node {
    return {
      id: null,
      parentId: -1,
      version: null,
      content: null,
      outgoingNodes: null,
      footnotes: null,
      section: null,
      index: 0,
      guidelineId: this.guidelineId,
    };
  }

  private createNewNode(root = false): Node {
    return {
      id: null,
      parentId: -1,
      version: null,
      content: null,
      createdBy: this.loggedinUserDisplayName,
      outgoingNodes: null,
      footnotes: null,
      section: null,
      index: 0,
      guidelineId: this.guidelineId,
      root,
    };
  }

  // An invisible top level parent node for multiple parent roots
  private createVirtualRoot(
    node: Node,
    childNode: Node,
    realNodes: GraphNode[]
  ): GraphNode {
    const graphNode = new GraphNode(node);
    graphNode.setIsRoot();
    const childrenNode = new GraphNode(childNode);
    childrenNode.setIsAddParent();

    graphNode.x = 0; // Fix for spacing between nodes
    graphNode.y = 57; // this is the root - Fix for icons placement
    graphNode.width = 212;
    graphNode.height = 67;

    childrenNode.width = 212;
    childrenNode.height = 20;
    childrenNode.setParent(graphNode);

    realNodes.forEach((realNode) => {
      realNode.setIsRoot();
      graphNode.children.push(realNode);
    });
    graphNode.children.push(childrenNode);
    return graphNode;
  }

  private createGraphNode(
    svgRef: ElementRef<SVGElement>,
    node: GraphNode[],
    gNode: GraphNode,
    nodeMap: NodeMap,
  ): void {
    this.gNode = gNode;

    const count = 1;
    const lineX1 = 110; // fix for spacing between nodes.
    const lineX2 = 110; // fix for spacing between nodes.
    const lineY1 = 0;
    const lineY2 = 47; // graph node - Fix for icon placement

    const posX = gNode.x;
    const posY = gNode.y;


    // Preparing the canvas for the d3 drawing
    const mainGrp = this.renderMainGroupForRootNode(svgRef, gNode);

    // attaching text box to the canvas
    const isChild = false;
    const textBox = this.attachTextBox(
      mainGrp.g,
      0,
      // 60,
      40, // fix for spacing between nodes.
      80,
      200,
      64,
      gNode,
      false,
      undefined
    );

    // Append the pencil icon
    const editImg = this.appendEditImg(mainGrp.g, null);

    // Append the down arrow
    const downArrowImg = this.appendDownArrowImg(mainGrp.g, null);

    // hover on the down arrow, click on Edit Icon, height adjustment, placement of downarrow
    this.commonActionsOnAnyNode(
      mainGrp,
      downArrowImg,
      editImg,
      null,
      textBox,
      isChild,
      gNode,
      false,
      null
    );

    gNode.node = mainGrp.block;

    // draw the tree based on the data coming from backend
    this.drawTreeWithData(
      gNode,
      mainGrp,
      node,
      nodeMap,
      posX,
      posY,
      count,
      lineX1,
      lineX2,
      lineY1,
      lineY2
    );
  }

  private drawChildGraphNodes(
    svgRef: ElementRef<SVGElement>,
    node: GraphNode[],
    gNode: GraphNode,
    parentId: any,
    nodeMap: NodeMap,
    posX: any,
    posY: any,
    id: string,
    lineX1: any,
    lineY1: any,
    lineX2: any,
    lineY2: any,
    parent: GraphNode,
    blockContent?: any,
    seeIcons?: boolean
  ): void {
    const isChild = true;
    const isStepChild = gNode.isStep;

    // Description: Calculate width of html element - dynamic width fix
    let originWidth = 212;

    if (gNode && gNode.content) {
      const temp = document.createElement('div');
      temp.style.position = 'absolute';
      temp.innerHTML = gNode.content;
      document.body.appendChild(temp);
      originWidth = temp.clientWidth;
      document.body.removeChild(temp);
    }

    // Get widths for svg, rectangle, text
    let svgWidth;
    let retangleWidth;
    let textWidth;
    if (originWidth <= 212) {
      svgWidth = 230;
      retangleWidth = 212;
      textWidth = 200;
      originWidth = 212;
    } else if (originWidth > 212 && originWidth < 512) {
      svgWidth = originWidth + 17;
      retangleWidth = originWidth;
      textWidth = originWidth - 12;
    } else {
      svgWidth = 530;
      retangleWidth = 512;
      textWidth = 500;
      originWidth = 512;
    }

    // A limit of 15 child nodes per parent node
    if (parseInt(id.replace('child', ''), 10) <= 15) {
      const content = 'New textbox';
      let childId = 0;
      nodeMap.nodes.forEach((element) => {
        if (element.id > childId) {
          childId = element.id;
        }
      });

      const newChild: Node = {
        id: childId + 1,
        parentId,
        version: 0,
        content: blockContent ? blockContent : content,
        outgoingNodes: null,
        footnotes: null,
        section: null,
        index: 0,
        guidelineId: this.guidelineId,
      };
      // prepare the canvas for drawing child nodes
      const mainChildGrp = this.renderMainGroupForChildNodes(
        svgRef,
        id,
        parentId,
        isStepChild,
        blockContent,
        svgWidth,
        gNode.id // Change for starting point navigation
      );

      // Append rectangle nodes
      mainChildGrp.svgContainer = this.appendRect(
        mainChildGrp.svgContainer,
        // posX + 20,
        posX, // Fix for spacing between nodes
        posY + 20, // added this to move the child - delete icon placement.
        retangleWidth,
        85,
        null,
        true,
        gNode && gNode.isAddParent,
        isStepChild
      );

      // attach text box
      const textBox = this.attachTextBox(
        mainChildGrp.svgContainer,
        id,
        // posX + 30,
        posX + 10, // Fix for spacing between nodes
        posY + 30,
        textWidth,
        64,
        gNode,
        isChild,
        blockContent,
        isStepChild
      );

      let editImg;
      let downArrowImg;
      let freeFormImg;

      if (seeIcons === undefined && !isStepChild && !this.isPreviewMode && !this.isReviewMode) {
        editImg = this.appendEditImg(
          null,
          mainChildGrp.svgContainer,
          true,
          posX,
          posY,
          svgWidth - 45
        );

        downArrowImg = this.appendDownArrowImg(
          null,
          mainChildGrp.svgContainer,
          true,
          posX,
          posY,
          (svgWidth - 50) / 2
        );


        freeFormImg = this.appendFreeFormImg(
          null,
          mainChildGrp.svgContainer,
          true,
          posX,
          posY,
          (svgWidth - 50) / 2 + this.DOWN_FREE_IMG_SPACING
        );
      }

      const defs = mainChildGrp.svgContainer.append('defs');

      // draw link arrows
      this.appendLinks(
        mainChildGrp.svgContainer,
        defs,
        lineX1,
        lineX2,
        lineY1,
        lineY2,
        mainChildGrp.lineBlock,
        parentId,
        id,
        this,
        gNode
      );
      if (this.isStartingPointNode(gNode) && !isStepChild){
        this.appendGreenCheckImg(
          mainChildGrp.svgContainer,
          originWidth - 15,
          
        );
      }

      if (this.shouldShowComments) {
        this.renderComments(gNode, mainChildGrp, originWidth - 15, textBox);
      }

      const count = 1;
      if (gNode == null || !gNode.isAddParent) {
        if (seeIcons === undefined && !this.isPreviewMode && !this.isReviewMode) {
          // hover on the down arrow, click on Edit Icon, height adjustment, placement of downarrow
          this.commonActionsOnAnyNode(
            mainChildGrp,
            downArrowImg,
            editImg,
            freeFormImg,
            textBox,
            isChild,
            gNode,
            showFreeFormIcon,
            mainChildGrp.block
          );
        }
      } else if (!this.isPreviewMode && !this.isReviewMode) {
        this.activateGreyedOutNode(mainChildGrp);
      }

      // Height adjustmnet of the rect based on the content coming from backend
      
      this.adjustHeight(textBox.text);

      // For drawing grandchildren
      if (gNode != null) {
        if (!isStepChild) {
          this.drawTreeWithData(
            gNode,
            mainChildGrp,
            node,
            nodeMap,
            posX,
            posY,
            count,
            lineX1,
            lineX2,
            lineY1,
            lineY2
          );
        }
      }
    }
  }

  private createRelationship(gNode: GraphNode): void {
    this.store.dispatch(createRelationship({ parentId: gNode.id, childId: null }));
  }

  private createStepChildRelationship(
    sourceGNode: Node,
    destGnode: Node
  ): void {
    if (sourceGNode && destGnode){
      if (sourceGNode.id !== destGnode.id) {
        this.store.dispatch(createRelationship({ parentId: sourceGNode.id, childId: destGnode.id, isStep: true }));
      } else {
        this._alertService.open(CONNECT_TO_SELF_WARNING_MESSAGE, AlertType.Warning);
      }
    }
  }

  private mapFromGraphNode(gNode: GraphNode): Node {
    return this.nodeMap.nodes.find((node) => node.id === gNode.id);
  }

  private commonActionsOnAnyNode(
    mainGrp: any,
    downArrowImg: any,
    editImg: any,
    freeFormImg: any,
    textBox: any,
    isChild: any,
    gNode: any,
    showFreeFormIcon: boolean,
    block: any
  ) {
    this.downArrowHoverActions(
      isChild ? mainGrp.svgContainer : mainGrp.g,
      downArrowImg,
      freeFormImg,
      showFreeFormIcon
    );
    this.clickActions(
      downArrowImg,
      editImg,
      freeFormImg,
      gNode,
      block,
      textBox
    );
    // Height adjustmnet of the rect based on the content saved in the text editor
    let foHeight = this.adjustHeight(textBox.text);

    const downOffset = 105;
    if (downArrowImg){
      downArrowImg.attr('y', foHeight + downOffset); // offset for delete icon placement
    }
    if (freeFormImg) {
      freeFormImg.attr('y', foHeight + downOffset); // offset for delete icon placement
    }

    if (gNode.children.length) {
      downArrowImg?.attr('x', this.DEFAULT_ACTION_BUTTON_OFFSET);
      freeFormImg?.attr('x', this.DEFAULT_ACTION_BUTTON_OFFSET + this.DOWN_FREE_IMG_SPACING);
    }
  }

  private renderMainGroupForRootNode(
    svgRef: ElementRef<SVGElement>,
    gNode: GraphNode
  ): any {
    const totHeight = 0;
    const block = d3
      .select(svgRef.nativeElement)
      .append('div')
      .attr('class', 'main_svg_block')
      .style('display', 'none');

    const main = d3
      .select(svgRef.nativeElement)
      .append('div')
      .attr('class', 'main_block')
      .style('padding-left', '20px'); // Fix for spacing between nodes

    const svgContainer = block
      .append('svg')
      .attr('width', 2000)
      .attr('height', 500);

    let g = svgContainer
      .append('g')
      .attr('id', 'node-unique-' + gNode.id) // Change for starting point navigation
      .attr('transform', 'translate(20,' + totHeight + ')');

    g = this.appendRect(
      null,
      gNode.x,
      gNode.y,
      gNode.width,
      gNode.height,
      g,
      false,
      false
    );
    return { g, main, block, svgContainer };
  }

  // Description: I added fifth parameter for set width of svg for the dynamic width fix
  private renderMainGroupForChildNodes(
    svgRef: ElementRef<SVGElement>,
    id: any,
    parentId: any,
    isStepChild: boolean,
    blockContent?: any,
    svgWidth?: number,
    nodeId?: number // Change for starting point navigation
  ): any {
    let block;
    if (svgRef.nativeElement === undefined) {
      if (svgRef['_groups'] !== undefined) {
        block = d3.select(svgRef['_groups'][0][0]).append('div');

        if (blockContent !== undefined) {
          block.attr(
            'class',
            'parentID_' + parentId + ' ' + id + ' child_block blue_block'
          );
        } else {
          block.attr('class', 'parentID_' + parentId + ' ' + id + ' child_block');
        }
      } else {
        block = d3.select(svgRef).append('div');

        if (blockContent !== undefined) {
          block.attr(
            'class',
            'parentID_' + parentId + ' ' + id + ' child_block blue_block'
          );
        } else {
          block.attr(
            'class',
            'parentID_' + parentId + ' ' + id + ' child_block'
          );
        }
      }
    } else {
      block = d3.select(svgRef.nativeElement).append('div').attr('class', id);
    }
    const parentNodesLength = block._groups[0][0].parentNode.childNodes.length;
    if (parentNodesLength !== 0) {
      const cl = block._groups[0][0].parentNode.childNodes[
        parentNodesLength - 1
      ].classList[1].replace('child', '');
      if (parseInt(cl) !== parentNodesLength) {
        id = 'child' + parentNodesLength;
        block
          .attr(
            'class',
            'parentID_' +
              parentId +
              ' ' +
              'child' +
              parentNodesLength +
              ' child_block'
          )
          .attr('id', 'tree' + parentNodesLength);
      }
    }

    const svgContainer = block
      .append('div')
      // .attr('style', 'height: 155px') //Fix for icon placement
      .append('svg')
      .attr('id', id)
      // .attr('width', 300)
      .attr('width', svgWidth) // Fix for spacing between nodes
      .attr('height', 160)
      .append('g')
      .attr('id',  + isStepChild ? 'node-unique-step-' + nodeId : 'node-unique-' + nodeId); // Change for starting point navigation

    const lineBlock = block
      .append('div')
      .attr('class', 'lineBlock' + id.replace('child', ''))
      .attr(
        'style',
        // 'position:absolute; width: 100%; height: 5px; top: 34px; left: 180px; border-top: 1px solid black; opacity: 0.12; display: none'
        // Fix for spacing between nodes
        'position:absolute; width: 100%; height: 5px; top: 34px; left: 110px; border-top: 1px solid black; opacity: 0.12; display: none'
      );
    const main = block.append('div').attr('class', 'main_block');
    return { block, svgContainer, lineBlock, main };
  }

  private adjustHeight(text: any): number {
    const temp = text._groups[0][0].getBoundingClientRect().height;
    let foHeight = temp * 0.5 / this.currentZoomLevel;
    
    if (foHeight < 24) {
      foHeight = 24;
    }
    // Dynamic adjustment of height based on the height of the html content
    text._groups[0][0].parentNode.style.height = foHeight + 'px';
    text._groups[0][0].parentNode.parentNode.setAttribute(
      'height',
      foHeight + 20
    );
    text._groups[0][0].parentNode.parentNode.parentNode
      .querySelector('rect')
      .setAttribute('height', foHeight + 40); // Changed from 40 to 30, shrink padding by 10px
    text._groups[0][0].parentNode.parentNode.parentNode.parentNode.setAttribute(
      'height',
      foHeight + 130 // offset for delete icon placement
    );
    text._groups[0][0].parentNode.parentNode.parentNode.parentNode.parentNode.style.height =
      foHeight + 117 + 'px'; // Changed: Shrink div by 10px

    return  foHeight;
  }

  private drawTreeWithData(
    gNode: GraphNode,
    mainGrp: any,
    node: GraphNode[],
    nodeMap: NodeMap,
    posX: any,
    posY: any,
    count: any,
    lineX1: any,
    lineX2: any,
    lineY1: any,
    lineY2: any
  ): void {
    if (gNode.children.length !== 0) {
      for (const child of gNode.children) {
        this.drawChildGraphNodes(
          mainGrp.main,
          node,
          child,
          gNode.id,
          nodeMap,
          posX,
          posY,
          'child' + count,
          lineX1,
          lineY1,
          lineX2,
          lineY2,
          null
        );
        count++;
      }
    }
  }

  private clickActions(
    downArrowImg: any,
    editImg: any,
    freeFormImg: any,
    gNode: GraphNode,
    block: any,
    textBox: any
  ) {
    // Logic for clicking on the down arrow
    if (downArrowImg){
      downArrowImg.on('click',() => {
        this.createRelationship(gNode);
        this.left = document.querySelector('mat-sidenav-content').scrollLeft;
        this.top = document.querySelector('mat-sidenav-content').scrollTop;
      });
    }


    // Logic for clicking on the edit  button
    if (editImg){
      editImg.on('click', () => {
        this.currentNode = this.mapFromGraphNode(gNode);
        this.left = document.querySelector('mat-sidenav-content').scrollLeft;
        this.top = document.querySelector('mat-sidenav-content').scrollTop;
        this.toggleTextEditor();
      });
    }


    // Logic for clicking on the freeFormImg  button - click on the source
    if (freeFormImg !== null) {
      this.freeFormImgClickAction(freeFormImg, block, gNode, this.nodeMap);
    }

    this.textClickAction(
      textBox
    );
  }

  private downArrowHoverActions(
    g: any,
    downArrowImg: any,
    freeFormImg: any,
    _showFreeFormIcon: boolean
  ) {
    g.style('pointer-events', 'all'); // Changed: G element should listen all mouse events
    g.on('mouseover', function () {
      // added this to check whether the line node exists - delete icon
      if (d3.select(this).select('line')._groups[0][0]) {
        // added this to get the id of the line node to apply to the image - delete icon
        const lid = d3.select(this).select('line').attr('id');
        d3.select(this)
          .select('[id="' + 'i_' + lid.split('_')[1] + '"]')
          .style('opacity', '1'); // showing the icon when mouseover based on the line id the image id is selected - delete icon
      }
      if(downArrowImg){
        downArrowImg.style('display', 'block');
      }
      if (freeFormImg && _showFreeFormIcon) {
        freeFormImg.style('display', 'block');
      }
      d3.select(this).select('rect').style('fill', '#fff');
    }).on('mouseleave', function() {
      // added this to check whether the line node exists - delete icon
      if (d3.select(this).select('line')._groups[0][0]) {
        // added this to get the id of the line node to apply to the image - delete icon
        const lid = d3.select(this).select('line').attr('id');
        d3.select(this)
          .select('[id="' + 'i_' + lid.split('_')[1] + '"]')
          .style('opacity', '0'); // hiding the icon when mouseover based on the line id the image id is selected - delete icon
      }
      if (downArrowImg){
        downArrowImg.style('display', 'none');
      }

      if (freeFormImg && _showFreeFormIcon) {
        freeFormImg.style('display', 'none');
      }
      d3.select(this).select('rect').style('fill', 'none');
    });
  }

  private textClickAction(
    text: any,
  ) {
    const createStepChildRelationship = this.createStepChildRelationship;
    text.text.on('click', function(e) {
      document.querySelector<HTMLBaseElement>('.tooltop').style.display =
        'none';
      document.querySelector<HTMLBaseElement>('.graph-block').style.cursor =
        'default';
      if (pressedBlock !== null) {
        text.gNode.children = null;
        destNodeContext = text.gNode;
        createStepChildRelationship(sourceNodeContext, destNodeContext);
      }
    });
  }

  // Fix for spacing between nodes
  private freeFormImgClickAction(
    freeFormImg: any,
    block: any,
    gNode: any,
    nodeMap: NodeMap
  ) {
    if (freeFormImg) {
    freeFormImg.on('click', function(e) {
      sourceNodeContext = gNode;
      pressedBlock = block;
      const scrollParent = document.getElementsByTagName(
        'mat-sidenav-content'
      )[0];

      document.querySelector<HTMLBaseElement>('.tooltop').style.display =
        'block';
      document.querySelector<HTMLBaseElement>('.tooltop').style.top =
        e.pageY - 30 + scrollParent.scrollTop + 'px';
      document.querySelector<HTMLBaseElement>('.tooltop').style.left =
        e.pageX - 30 + scrollParent.scrollLeft + 'px';
      document.querySelector<HTMLBaseElement>('.graph-block').style.cursor =
        'pointer';

      const parent = document.querySelector<HTMLBaseElement>('.graph-block');
      parent.onmouseover = parent.onmouseout = parent.onmousemove = handler;

      function handler(event) {
        if (pressedBlock !== null) {
          const X = event.pageX;
          const Y = event.pageY;
          const top = Y - 30;
          const left = X - 30;

          // tslint:disable-next-line: no-shadowed-variable
          const scrollParent = document.getElementsByTagName(
            'mat-sidenav-content'
          )[0];
          document.querySelector<HTMLBaseElement>('.tooltop').style.top =
            top + scrollParent.scrollTop + 'px';
          document.querySelector<HTMLBaseElement>('.tooltop').style.left =
            left + scrollParent.scrollLeft + 'px';
          return false;
        }
      }
    });
    }
  }

  private appendLinks(
    svgContainer: any,
    defs: any,
    lineX1: any,
    lineX2: any,
    lineY1: any,
    lineY2: any,
    lineBlock: any,
    parentId: any,
    id: any,
    thisRef?: any,
    gNode?: any
  ): void {
    const marker = defs
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', '10')
      .attr('markerHeight', '7')
      .attr('refX', '0')
      .attr('refY', '3.5')
      .attr('orient', 'auto');

    marker.append('polygon').attr('points', '0 0, 10 3.5, 0 7');
    if (parentId !== 0) {
      const idgen = Math.random();
      const line = svgContainer
        .append('line')
        .attr('x1', lineX1)
        .attr('x2', lineX2)
        .attr('y2', lineY2 + 20) // added this to move the line for delete icon placement
        .attr('style', 'fill:none')
        .attr('stroke', 'black')
        .attr('stroke-width', '1')
        .attr('opacity', 0.12)
        .attr('id', 'l_' + idgen) // ID is not added =>delete icon placement
        .attr('marker-end', 'url(#arrowhead)');

      if (id === 'child1') {
        line.attr('y1', lineY1); // Changed: Line should start from zero point.
        const y = lineY1 + 20 + (lineY2 + 20 - (lineY1 + 25)) / 2;
        svgContainer
          .append('svg:image')
          .attr('class', 'nodeDelete')
          .attr('rel', 'delete')
          .attr('x', lineX1 - 10) // added to adjust x axis
          .attr('y', y) // added the y variable
          .attr('width', '20') // width of the icon
          .attr('height', '20') // height of the icon
          .attr(
            'xlink:href',
            './assets/system-icon-outlined-icons-edit-icon-remove.svg'
          )
          .attr('id', 'i_' + idgen) // added id to refer the same for hide or show
          .style('cursor', 'pointer')
          .style('opacity', 0) // initial state is hidden
          .on('click', function () {
            thisRef.openDeleteDialog(parentId, gNode.id);
          });
      } else {
        line.attr('y1', lineY1 + 35); // added 20 to this  to move the child
        const y = lineY1 + 20 + (lineY2 + 20 - (lineY1 + 25)) / 2; // find the center of the line
        svgContainer
          .append('svg:image')
          .attr('class', 'nodeDelete')
          .attr('x', lineX1 - 10) // added to adjust x axis
          .attr('y', y) // added the y variable
          .attr('rel', 'delete')
          .attr('width', '20') // width of the icon
          .attr('height', '20') // height of the icon
          .attr('id', 'i_' + idgen) // added id to refer the same for hide or show
          .attr(
            'xlink:href',
            './assets/system-icon-outlined-icons-edit-icon-remove.svg'
          )
          .style('cursor', 'pointer')
          .style('opacity', 0) // initial state is hidden
          .on('click', function () {
            thisRef.openDeleteDialog(parentId, gNode.id);
          });
        const c = parseInt(id.replace('child', ''), 10);
        lineBlock._groups[0][0].parentNode.parentNode.childNodes[
          c - 2
        ].querySelector('.lineBlock' + (c - 1)).style.display = 'block';
      }
    }
  }

  private attachTextBox(
    g: any,
    id: any,
    x: number,
    y: number,
    width: any,
    height: any,
    gNode: GraphNode,
    isChild: boolean,
    blockContent: any,
    isStepChild?: boolean
  ): any {
    const text = g
      .append('foreignObject')
      .attr('width', width)
      .attr('height', height)
      .attr('x', x)
      .attr('y', y)
      .attr('id', isChild ? 'textBox' + id.replace('child', '') : 'textBox')
      .attr(
        'style',
        isChild ? 'overflow: auto' : 'overflow: auto; height: 64px'
      )
      .append('xhtml:body')
      .append('div')
      .style('margin', '0px')
      .style('color', isStepChild ? '#0066CC' : 'black')
      .style('width', width - 30 + 'px')
      .style('word-break', 'keep-all');

    if (blockContent !== undefined) {
      text.html(blockContent);
    } else if (gNode && gNode.content) {
      text.html(gNode.content);
    } else {
      text.html('<span>' + 'New textbox' + '</span>');
    }
    return { text, gNode };
  }

  private appendRect(
    svgContainer: any,
    posX: any,
    posY: any,
    width: any,
    height: any,
    g: any,
    isChild: boolean,
    isAddParent: boolean,
    isStepChild?: boolean
  ): any {
    if (!isChild && !(isAddParent && !this.isPreviewMode && !this.isReviewMode)) {
      g.append('rect')
        .attr('x', posX)
        .attr('y', posY)
        .attr('width', width)
        .attr('height', height)
        .attr('style', 'fill:#fff')
        .attr('opacity', 0.12)
        .attr('stroke', 'black')
        .attr('stroke-width', '1')
        .style('stroke-dasharray', isAddParent ? '10 10' : '');
      return g;
    }
    svgContainer
      .append('rect')
      .attr('x', posX)
      .attr('y', posY)
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'fill:#fff')
      .attr('stroke', isStepChild ? '#0066CC' : 'black')
      .attr('opacity', isStepChild ? 0.65 : 0.12)
      .attr('stroke-width', '1')
      .style('stroke-dasharray', isAddParent ? '10 10' : '');

    return svgContainer;
  }

  // Description: I added sixth parameter for set icon position by offset after the dynamic width changes
  private appendEditImg(
    g: any,
    svgContainer: any,
    isChild = false,
    posX = 235,
    posY = 75,
    offset = 180,
    width = 24,
    height = 24
  ): any {
    let editImg: any;
    if (!isChild) {
      editImg = g
        .append('svg:image')
        .attr('class', 'textEdit')
        .attr('x', posX)
        .attr('y', posY + 20) // added this to move the text edit image - delete icon placement
        .attr('width', width)
        .attr('height', height)
        .attr('xlink:href', './assets/edit-24-px.svg')
        .style('cursor', 'pointer');
      return editImg;
    }
    editImg = svgContainer
      .append('svg:image')
      .attr('class', 'textEdit')
      .attr('x', posX + offset) // Fix for spacing between nodes
      .attr('y', posY + 30) // delete icon placement
      .attr('width', 24)
      .attr('height', 24)
      .attr('xlink:href', './assets/edit-24-px.svg')
      .style('cursor', 'pointer');
    return editImg;
  }

  // Date: 2020-11-29
  // Description: I added sixth parameter for set icon position by offset
  private appendDownArrowImg(
    g: any,
    svgContainer: any,
    isChild = false,
    posX = 120, // Fix for spacing between nodes
    posY = 75,
    offset = this.DEFAULT_ACTION_BUTTON_OFFSET
  ): any {
    let downArrowImg: any;
    if (!isChild) {
      downArrowImg = g
        .append('svg:image')
        .attr('class', 'downArrow')
        // .attr('x', 150)
        .attr('x', 120) // Fix for spacing between nodes
        .attr('y', 75)
        .attr('width', 24)
        .attr('height', 24)
        .style('display', 'none')
        .attr('xlink:href', './assets/arrow_circle_down-24px.svg')
        .style('cursor', 'pointer');
      return downArrowImg;
    }
    downArrowImg = svgContainer
      .append('svg:image')
      .attr('class', 'downArrow')
      // .attr('x', posX + 120)
      .attr('x', posX + offset) // Fix for spacing between nodes
      .attr('y', posY)
      .attr('width', 24)
      .attr('height', 24)
      .style('display', 'none')
      .attr('xlink:href', './assets/arrow_circle_down-24px.svg')
      .style('cursor', 'pointer');
    return downArrowImg;
  }

  private appendFreeFormImg = (
    g: any,
    svgContainer: any,
    isChild = false,
    posX = 150,
    posY = 75,
    offset = 350
  ): any => {
    let freeFormImg: any;
    if (!isChild) {
      freeFormImg = g
        .append('svg:image')
        .attr('class', 'freeFormIcon')
        // .attr('x', 170)
        .attr('x', 140) // Fix for spacing between nodes
        .attr('y', 75 + 20) // added 20 to move the navigation icon
        .attr('width', 24)
        .attr('height', 24)
        .style('display', 'none')
        .attr(
          'xlink:href',
          './assets/system-icon-outlined-icons-navigation-icon-freeform.svg'
        )
        .style('cursor', 'pointer');
      return freeFormImg;
    }
    freeFormImg = svgContainer
      .append('svg:image')
      .attr('class', 'freeFormIcon')
      .attr('x', posX + offset) // free form image - Fix for icon placement //conflict fix for spacing too
      .attr('y', posY + 20) // added this to move the navigation icon - delete icon placement
      .attr('width', 24)
      .attr('height', 24)
      .style('display', 'none')
      .attr(
        'xlink:href',
        './assets/system-icon-outlined-icons-navigation-icon-freeform.svg'
      )
      .style('cursor', 'pointer');
    return freeFormImg;
  }

  private activateGreyedOutNode(g: any) {
    showFreeFormIcon = true;
    g.svgContainer.on('click', () => {
      const sidenavEl = document.querySelector('mat-sidenav-content');
      if (sidenavEl) {
        this.left = sidenavEl.scrollLeft;
        this.top = sidenavEl.scrollTop;
      }
      d3.select(
        g.svgContainer._groups[0][0].parentNode.parentNode.parentNode
      ).remove();
      this.store.dispatch(create({ node: this.createNewNode(true) }));
    });
  }

  private appendGreenCheckImg(
    g: any,
    posX = 200, // Fix for spacing between nodes
    posY = 45, // green checker - fix for icon placement. //confilc - fix for spacing too.
    width = 24,
    height = 24
  ): void {
    g
      .append('svg:image')
      .attr('class', 'greenCheck')
      .attr('x', posX)
      .attr('y', posY + 20) // added this to move the green check icon - delete icon placement
      .attr('width', width)
      .attr('height', height)
      .attr(
        'xlink:href',
        './assets/system-icon-filled-icons-alert-icon-positive.svg'
      );
  }

  private renderComments(gNode: GraphNode, mainChildGrp: any, posX: any, text:any): void {
    let foHeight = this.adjustHeight(text.text);
    const downOffset = 105;
    let posY = foHeight + downOffset
    if (Object.keys(this.nodeCommentMap).length) {
      const commentsIds = this.nodeCommentMap[gNode.id];
      if (commentsIds) {
        const commentIcon = mainChildGrp
          .svgContainer
          .append('g')
          .attr('cursor', 'pointer')
          .html(this.renderCommentIcon(commentsIds.length, posX, posY));
        commentIcon.on('click', () => this.onSetExpandedNodeComments.emit(commentsIds));
      }
    }
  }

  private renderCommentIcon(length: number, posX: any, posY:any, x = 200, y = 130): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x="${posX}" y="${posY}" viewBox="0 0 24 24">
              <defs>
                <filter id="mpbsxohn9a">
                    <feColorMatrix in="SourceGraphic" values="0 0 0 0 0.000000 0 0 0 0 0.100000 0 0 0 0 0.800000 0 0 0 1.000000 0"/>
                </filter>
              </defs>
              <g fill="none" fill-rule="evenodd">
                  <g>
                      <g>
                          <g>
                              <g filter="url(#mpbsxohn9a)" transform="translate(-884 -565) translate(876 557) translate(8 8)">
                                  <path d="M0 0L24 0 24 24 0 24z"/>
                                  <path fill="#000" fill-rule="nonzero" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                              </g>
                              <text fill="#FFF" fill-opacity=".87" font-family="Roboto-Black, Roboto" font-size="12" font-weight="700" letter-spacing=".4" transform="translate(-884 -565) translate(876 557) translate(8 8)">
                                  <tspan x="8.325" y="14">${length}</tspan>
                              </text>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>`;
  }

  private isStartingPointNode(currentNode: GraphNode) {
    return this.startingPointNodeIds.ids.includes(currentNode.id);
  }

  private delete(parentId: number, childId: number): void {
    this.store.dispatch(removeRelationship({ parentId, childId }));
  }
}