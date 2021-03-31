import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNode from './node.reducer';

const getNodeState = createFeatureSelector<fromNode.State>(
  fromNode.nodeFeatureKey
);

export const selectActiveNode = createSelector(
  getNodeState,
  state => state.activeNode
);

export const selectNodes = createSelector(
  getNodeState,
  state => state.entities
);

export const selectNodeIsLoading = createSelector(
  getNodeState,
  state => state.isLoading
);

export const selectNodeErrors = createSelector(
  getNodeState,
  state => state.errors
);

export const selectPreviewMode = createSelector(
  getNodeState,
  state => state.isBothPreviewAndEditMode
);

export const { selectAll } = fromNode.adapter.getSelectors();

export const selectNodeMap = createSelector(
  getNodeState,
  state => {
    return { rootNodes: state.rootNodes, nodes: selectAll(state) };
  }
);

export const selectNodesByIds = createSelector(
  getNodeState,
  (state, data) => selectAll(state).map(node => {
    if (data.ids.indexOf(node.id) > -1) {
      return { id: node.id, content: node.content };
    }
  }).filter(Boolean)
);

export const selectFeature = (state: fromNode.State) => state.entities;

export const selectNodeComponentViewModel = createSelector(
  selectActiveNode,
  selectNodes,
  selectNodeIsLoading,
  selectNodeErrors,
  (activeNode, nodes, isLoading, errors) => ({
    activeNode,
    nodes,
    isLoading,
    errors
  })
);
