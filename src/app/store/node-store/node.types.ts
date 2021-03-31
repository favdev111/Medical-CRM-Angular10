import { Node } from 'src/app/models/dto/node';
import { UpdatePayload } from '../shared';

export enum NodeActionTypes {
  SELECT = '[Nodes] Select',
  CREATE = '[Nodes] Create',
  CREATE_SUCCESS = '[Nodes] Create Success',
  CREATE_FAILURE = '[Nodes] Create Failure',
  UPDATE = '[Nodes] Update',
  UPDATE_SUCCESS = '[Nodes] Update Success',
  UPDATE_MANY_SUCCESS = '[Nodes] Update Many Success',
  UPDATE_FAILURE = '[Nodes] Update Failure',
  REMOVE = '[Nodes] Remove',
  REMOVE_SUCCESS = '[Nodes] Remove Success',
  REMOVE_FAILURE = '[Nodes] Remove Failure',
  REMOVE_MANY_SUCCESS = '[Nodes] Remove Many Success',
  LOAD_NODE_MAP_SUCCEEDED = '[Nodes] Load Node Map Success',
  CREATE_RELATIONSHIP = '[Nodes] Create Relationship',
  CREATE_RELATIONSHIP_SUCCEEDED = '[Nodes] Create Relationship Success',
  CREATE_RELATIONSHIP_FAILURE = '[Nodes] Create Relationship Failure',
  REMOVE_RELATIONSHIP = '[Nodes] Remove Relationship',
  REMOVE_RELATIONSHIP_SUCCEEDED = '[Nodes] Remove Relationship Success',
  REMOVE_RELATIONSHIP_FAILURE = '[Nodes] Remove Relationship Failure',
  PREVIEW_MODE = '[Nodes] Preview Mode',
}

export interface NodeCreatePayload {
  node: Node;
}

export interface NodeUpdatePayload {
  id: number;
  changes: Node;
}

export interface NodeUpdateManyPayload {
  updatedNodes: UpdatePayload<Node>[];
}

export interface NodeDeleteRelationshipUpdate {
  updatedNodes: UpdatePayload<Node>[];
  deletedNodeIds?: number[];
}
