import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNodeComment from './node-comment.reducer';

const getNodeCommentState = createFeatureSelector<fromNodeComment.State>(
  fromNodeComment.nodeCommentFeatureKey
);

export const { selectAll } = fromNodeComment.adapter.getSelectors();

export const selectNodeCommentMap = createSelector(
  getNodeCommentState,
  state => state.nodeCommentMap
);

export const selectAllNodeComments = createSelector(
  getNodeCommentState,
  state => selectAll(state)
);

export const selectExpandedNodeComments = createSelector(
  getNodeCommentState,
  state => state.expandedNodeComments
);
