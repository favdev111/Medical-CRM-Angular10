import { GraphNode } from './graph-node';

export class GraphEdge {
  id: number;
  sourceId: number;
  targetId: number;
  color?: string;

  source: GraphNode | string | number;
  target: GraphNode | string | number;

  constructor(source, target) {
    this.source = source;
    this.target = target;
  }
}

