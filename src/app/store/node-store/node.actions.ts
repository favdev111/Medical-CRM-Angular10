import { createAction, props } from '@ngrx/store';

import { Node, NodeMap, NodeRelationship, NodeUpdate } from 'src/app/models/dto/node';
import { NodeActionTypes, NodeUpdatePayload, NodeCreatePayload, NodeDeleteRelationshipUpdate, NodeUpdateManyPayload } from './node.types';
import { RemovePayload, RemoveManyPayload } from '../shared';

export const select = createAction(
  NodeActionTypes.SELECT,
  props<{ activeNode: Node }>()
);

export const previewMode = createAction(
  NodeActionTypes.PREVIEW_MODE,
  props<{ isBothPreviewAndEditMode: boolean }>()
);

export const loadNodeMapSucceeded = createAction(
  NodeActionTypes.LOAD_NODE_MAP_SUCCEEDED,
  props<{ nodeMap: NodeMap }>()
);

export const create = createAction(
  NodeActionTypes.CREATE,
  props<NodeCreatePayload>()
);

export const update = createAction(
  NodeActionTypes.UPDATE,
  props<NodeUpdatePayload>()
);

export const remove = createAction(
  NodeActionTypes.REMOVE,
  props<RemovePayload>()
);

// Todo make this a response not just a node
export const createSucceeded = createAction(
  NodeActionTypes.CREATE_SUCCESS,
  props<NodeCreatePayload>()
);

export const removeSucceeded = createAction(
  NodeActionTypes.REMOVE_SUCCESS,
  props<RemoveManyPayload>()
);

export const updateSucceeded = createAction(
  NodeActionTypes.UPDATE_SUCCESS,
  props<{ id: number, changes: Partial<Node> }>()
);

export const updateManySucceeded = createAction(
  NodeActionTypes.UPDATE_MANY_SUCCESS,
  props<NodeUpdateManyPayload>()
);

export const createFailed = createAction(
  NodeActionTypes.CREATE_FAILURE,
  props<{ errors: string | string[] }>()
);

export const removeFailed = createAction(
  NodeActionTypes.REMOVE_FAILURE,
  props<{ errors: string | string[] }>()
);

export const updateFailed = createAction(
  NodeActionTypes.UPDATE_FAILURE,
  props<{ errors: string | string[] }>()
);

export const createRelationship = createAction(
  NodeActionTypes.CREATE_RELATIONSHIP,
  props<NodeRelationship>()
);

export const createRelationshipSucceeded = createAction(
  NodeActionTypes.CREATE_RELATIONSHIP_SUCCEEDED,
  props<NodeUpdate>()
);

export const createRelationshipFailed = createAction(
  NodeActionTypes.CREATE_RELATIONSHIP_FAILURE,
  props<{ errors: string | string[] }>()
);

export const removeRelationship = createAction(
  NodeActionTypes.REMOVE_RELATIONSHIP,
  props<NodeRelationship>()
);

export const removeRelationshipSucceeded = createAction(
  NodeActionTypes.REMOVE_RELATIONSHIP_SUCCEEDED,
  props<NodeDeleteRelationshipUpdate>()
);

export const removeRelationshipFailed = createAction(
  NodeActionTypes.REMOVE_RELATIONSHIP_FAILURE,
  props<{ errors: string | string[] }>()
);


