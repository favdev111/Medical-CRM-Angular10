import * as d3 from './d3.graph.utils';
import { createGraphNode, createNodeMap1, createNodeMap2 } from '../test-utils/d3-factory';
import { createNodeA, createNodeB, createNodeC } from '../test-utils/dto-factory';
import { GraphNode } from './models/graph';

describe('D3 Service', () => {
  it('should create root with one child', () => {
    // given
    const nodes = [createNodeA(), createNodeB(false)];
    const nodeMap = createNodeMap1(nodes);
    const expectedRootGraphNode = createGraphNode(nodes[0]);
    const expectedChildGraphNode = createGraphNode(nodes[1], true);

    expectedChildGraphNode.parent = expectedRootGraphNode;
    expectedRootGraphNode.children.push(expectedChildGraphNode);


    // act
    const actual: GraphNode[] = d3.mapToGraphNodes(nodeMap);

    // assert
    expect(actual).toEqual([expectedRootGraphNode]);

  });

  it('should create two roots sharing a child', () => {
    // given
    const rootNode1 = createNodeA(false);
    const rootNode2 = createNodeB(false);
    const childNode = createNodeC();

    rootNode1.outgoingNodes.push({ childNodeId: childNode.id, step: false });
    rootNode2.outgoingNodes.push({ childNodeId: childNode.id, step: true });

    const nodes = [rootNode1, rootNode2, childNode];
    const nodeMap = createNodeMap2(nodes);

    const expectedRootGraphNode1 = createGraphNode(rootNode1);
    const expectedChildGraphNodeNoStep = createGraphNode(childNode, true);
    expectedChildGraphNodeNoStep.parent = expectedRootGraphNode1;
    expectedRootGraphNode1.children.push(expectedChildGraphNodeNoStep);
    
    const expectedRootGraphNode2 = createGraphNode(rootNode2);
    const expectedChildGraphNodeIsStep = createGraphNode(childNode, true);
    expectedChildGraphNodeIsStep.parent = expectedRootGraphNode2;
    expectedChildGraphNodeIsStep.isStep = true;
    expectedRootGraphNode2.children.push(expectedChildGraphNodeIsStep);

    // act
    const actual: GraphNode[] = d3.mapToGraphNodes(nodeMap);

    // assert
    expect(actual).toEqual([expectedRootGraphNode1, expectedRootGraphNode2]);

  });
});
