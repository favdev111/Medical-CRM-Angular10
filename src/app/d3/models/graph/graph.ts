import { GraphNode } from './graph-node';
import { Size } from './size';

export interface Graph {
  rootNodes: GraphNode[];
  size: Size;
  center?: number;
  startingNodesCenterX?: number;
}
