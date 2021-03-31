import { Resource } from './resource';

export class Node implements Resource {
  id: number;
  parentId: number;
  index: number;
  version: number;
  content: string;
  footnotes: Footnotes[];
  outgoingNodes: OutgoingNode[];
  section: number;
  guidelineId: number;
  createdBy?: String;
  createdDate?: Date;
  lastModifiedBy?: String;
  lastModifiedDate?: Date;
  root?: boolean;
}

export interface NodeMap {
  rootNodes: number[];
  nodes: Node[];
}

export interface NodeRelationship {
  parentId: number;
  childId: number;
  isStep?: boolean;
}

export interface NodeUpdate {
  deletedNodeIds: number[];
  updatedNodes: Node[];
}

export interface Footnotes {
  id: string;
  reference: string;
  content: string;
}

export interface OutgoingNode {
  childNodeId: number;
  step: boolean;
}


