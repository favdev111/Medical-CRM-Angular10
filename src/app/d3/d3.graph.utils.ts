import { GraphNode } from './models/graph';
import { Node, NodeMap } from '../models/dto/node';

export const mapToGraphNodes = (nodeMap: NodeMap): GraphNode[] => {
  return nodeMap.rootNodes.map((rootNodeId: number) => {
    const rootNode: Node = nodeMap.nodes.filter(
      (node) => node.id === rootNodeId
    )[0];
    const rootGraphNode = mapToGraphNodesRecursive(rootNode, nodeMap);
    return rootGraphNode;
  });
};

const mapToGraphNodesRecursive = (node: Node, nodeMap: NodeMap): GraphNode => {
  const graphNode = new GraphNode(node);
  if (node.outgoingNodes && node.outgoingNodes.length > 0) {
    const childIds = node.outgoingNodes.map(outgoingNode => outgoingNode.childNodeId);
    nodeMap.nodes
      .filter((nodeChild) => childIds.indexOf(nodeChild.id) > -1)
      .map((filteredNode) => {
        const isStep = node.outgoingNodes.find(outgoingNode => outgoingNode.childNodeId === filteredNode.id).step;
        const child = isStep ? new GraphNode(filteredNode): mapToGraphNodesRecursive(filteredNode, nodeMap);
        graphNode.children.push(child);
        graphNode.x = 50;
        graphNode.y = 70;
        graphNode.width = 212;
        graphNode.height = 67;
        child.x = 50;
        child.y = 70;
        child.width = 212;
        child.height = 85;
        child.parent = graphNode;
        child.isStep = isStep;
      });
  }
  return graphNode;
};

export const clearTree = () => {
  const el: Element = document.querySelector('.main_svg_block');
  if (el) {
    el.remove();
    document.querySelector('.main_block').remove();
  }
};

