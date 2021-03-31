import { Node } from '../../../models/dto/node';
import { Point } from './point';
import { Size } from './size';

export class GraphNode {
  id: number;
  content: any;
  children?: GraphNode[];
  size: Size;
  isStep: boolean;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  position: Point;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  isRoot?: boolean;
  isAddParent ?: boolean;
  parent?: GraphNode;
  node?: any;
  rootNodeId: number;
  drawBackup?: any;

  constructor(node: Node) {
    this.id = node.id;
    this.content = node.content;
    this.children = [];
    this.size = null;
    this.height = null;
    this.width = null;
    this.x = null;
    this.y = null;
    this.position = null;
    this.vx = null;
    this.vy = null;
    this.fx = null;
    this.fy = null;
    this.isRoot = false;
    this.isAddParent = false;
    this.parent = null;
    this.isStep = false;
  }

  setIsRoot() {
    this.isRoot = true;
  }

  setIsAddParent() {
    this.isAddParent = true;
  }

  setParent(parent) {
    this.parent = parent;
  }
}
