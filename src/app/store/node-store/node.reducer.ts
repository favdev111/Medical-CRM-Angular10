import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';

import { Node } from 'src/app/models/dto/node';
import * as NodeActions from './node.actions';

export interface State extends EntityState<Node> {
  activeNode: Node;
  isLoading: boolean;
  errors: string | string[];
  rootNodes: number[];
  isBothPreviewAndEditMode: boolean;
}
export const adapter: EntityAdapter<Node> = createEntityAdapter<Node>();
export const initialState: State = {
  ...adapter.getInitialState(),
  activeNode: null,
  isLoading: false,
  errors: [],
  rootNodes: [],
  isBothPreviewAndEditMode: false
};

export const nodeFeatureKey = 'node';

const nodeReducer = createReducer(
  initialState,
  on(
    NodeActions.createSucceeded,
    (state, { node }) => {
      if (node.root) {
        const rootNodes = [...state.rootNodes, node.id];
        state = { ...state, rootNodes };
      }
      return adapter.addOne(node, state);
    }
  ),
  on(
    NodeActions.loadNodeMapSucceeded,
    (state, { nodeMap }) => {
      state = { ...state, ...nodeMap };
      return adapter.setAll(nodeMap.nodes, state);
    }
  ),
  on(
    NodeActions.removeSucceeded,
    (state, { ids }) => {
      const rootNodes = [...state.rootNodes];
      for (const id of ids) {
        const index = state.rootNodes.indexOf(id);
        if (index > -1) {
          rootNodes.splice(index, 1);
        }
      }
      
      state = { ...state, rootNodes };
      return adapter.removeMany(ids, state);
    }
  ),
  on(
    NodeActions.select,
    (state, { activeNode }) => ({ ...state, activeNode })
  ),
  on(
    NodeActions.previewMode,
    (state, { isBothPreviewAndEditMode }) => ({ ...state, isBothPreviewAndEditMode })
  ),
  on(
    NodeActions.updateSucceeded,
    (state, { id, changes }) => adapter.updateOne({ id, changes}, state)
  ),
  on(
    NodeActions.updateManySucceeded,
    (state, { updatedNodes }) => adapter.updateMany(updatedNodes, state)
  ),
  on(
    NodeActions.createRelationshipSucceeded,
    (state, { updatedNodes }) => adapter.upsertMany(updatedNodes, state)
  ),
  on(
    NodeActions.removeRelationshipSucceeded,
    (state, { updatedNodes, deletedNodeIds }) => {
      if (deletedNodeIds && deletedNodeIds.length) {
        state = adapter.removeMany(deletedNodeIds, state);
      }
      return adapter.updateMany(updatedNodes, state);
    }
  ),
  on(
    NodeActions.createFailed,
    NodeActions.removeFailed,
    NodeActions.updateFailed,
    NodeActions.createRelationshipFailed,
    NodeActions.removeRelationshipFailed,
    (state, { errors }) => ({ ...state, errors })
  )
);

export const reducer = (state: State | undefined, action: Action) => nodeReducer(state, action);
