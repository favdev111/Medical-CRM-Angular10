import { GraphNode } from '../d3';
import { NodeMap, Node } from '../models/dto/node';

export const createNodeMap1 = (nodes: Node[]): NodeMap => {
  return {
    rootNodes: [1],
    nodes
  };
};

export const createNodeMap2 = (nodes: Node[]): NodeMap => {
  return {
    rootNodes: [1, 2],
    nodes
  };
};

export const createGraphNode = (node: Node, isChild = false): GraphNode => {
  const graphNode = new GraphNode(node);
  graphNode.height = isChild ? 85 : 67;
  graphNode.width = 212;
  graphNode.x = 50;
  graphNode.y = 70;
  return graphNode;
}

