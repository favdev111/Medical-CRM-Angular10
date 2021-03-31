import { GraphEdge } from './graph-edge';
import { GraphNode } from './graph-node';

export class DirectedGraph {
  initSimulation(options: { width: number; height: number; }) {
    throw new Error('Method not implemented.');
  }

  public nodes: GraphNode[] = [];
  public links: GraphEdge[] = [];

  constructor(nodes, links, options: { width, height }) {
    this.nodes = nodes;
    this.links = links;
  }

  // tslint:disable-next-line: typedef
  connectNodes(source, target) {
    let link;

    if (!this.nodes[source] || !this.nodes[target]) {
      throw new Error('One of the nodes does not exist');
    }

    link = new GraphEdge(source, target);
    this.links.push(link);
  }
}
