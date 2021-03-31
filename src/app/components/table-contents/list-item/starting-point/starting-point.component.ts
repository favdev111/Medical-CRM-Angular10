import { Component, OnInit, Input } from '@angular/core';
import { NodeMap } from 'src/app/models/dto/node';
import { cloneDeep } from 'lodash';
import { Node } from 'src/app/models/dto/node';
import * as d3 from 'd3';

@Component({
  selector: 'app-starting-point',
  templateUrl: './starting-point.component.html',
  styleUrls: ['./starting-point.component.scss'],
})
export class StartingPointComponent implements OnInit {
  @Input() node: Partial<Node>;

  isShowMore = false;
  tooltip: HTMLDivElement;

  constructor() {}

  ngOnInit(): void {}

  showContent($event) {
    // TODO - Coming with a better approach for tooltip functionality using Mat tooltip or customizable tooltip directive.
    this.tooltip = document.createElement('div');
    this.tooltip.style.cssText = `position: absolute; width: 300px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); z-index: 1000; background: #fff; padding: 10px; overflow: hidden; height: 98px;`;
    this.tooltip.style.left = $event.pageX - 350 + 'px';
    this.tooltip.style.top = $event.pageY - 100 + 'px';
    let input = this.strip(this.node.content).trim();
    this.tooltip.innerHTML = this.truncate(input);
    document.body.append(this.tooltip);
  }

  hideContent() {
    this.tooltip.remove();
  }

  truncate(input) {
    if (input.length > 75) {
      return input.substring(0, 100) + '...';
    }
    return input;
  }

  strip(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  navigateToNodeOnGraph() {
    d3.selectAll('rect').style('fill', 'none');
    const uniqueNode = d3.select('#node-unique-' + this.node.id);
    if (uniqueNode) {
      uniqueNode
        .select('rect')
        .style('fill', '#55CC22')
        .attr('stroke', 'black')
        .attr('stroke-width', '1')
        .attr('opacity', 0.12);
      const { left, bottom } = uniqueNode.node().getBoundingClientRect();
      document.querySelector('mat-sidenav-content').scrollLeft += left - 200;
      document.querySelector('mat-sidenav-content').scrollTop += bottom - 200;
    }
  }
}
