import { Injectable } from '@angular/core';
import { GraphNode} from './models/graph';
import * as d3 from 'd3';

// TODO Needs to be enhanced. Not final version
@Injectable()
export class D3Service {
  /** This service will provide methods to enable user interaction with elements
   * while maintaining the d3 simulations physics
   */
  constructor() {}

  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement, containerElement): void {}

  /** A method to bind a draggable behaviour to an svg element */
  applyDraggableBehaviour(element, node: GraphNode): void {}
}
