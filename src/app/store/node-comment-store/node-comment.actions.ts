import { createAction, props } from '@ngrx/store';
import { NodeComment } from 'src/app/models/dto/node-comment';
import { ReviewDetails } from 'src/app/models/dto/review-details';

import { ErrorPayload } from '../shared';
import { NodeCommentActionTypes, UpdateNodeCommentStatusPayload } from './node-comment.types';

export const load = createAction(
  NodeCommentActionTypes.LOAD,
  props<{ reviewId: number }>()
);

export const loadSucceeded = createAction(
  NodeCommentActionTypes.LOAD_SUCCESS,
  props<{ reviewDetails: ReviewDetails }>()
);

export const loadFailed = createAction(
  NodeCommentActionTypes.LOAD_FAILURE,
  props<ErrorPayload>()
);

export const updateStatus = createAction(
  NodeCommentActionTypes.UPDATE_STATUS,
  props<NodeComment>()
);

export const updateStatusSucceeded = createAction(
  NodeCommentActionTypes.UPDATE_STATUS_SUCCESS,
  props<{ nodeCommentId: number, changes: NodeComment }>()
);

export const updateStatusFailed = createAction(
  NodeCommentActionTypes.UPDATE_STATUS_FAILURE,
  props<ErrorPayload>()
);

export const resetNodeComments = createAction(
  NodeCommentActionTypes.RESET_NODE_COMMENTS
);

export const setExpandedComments = createAction(
  NodeCommentActionTypes.SET_EXPANDED_NODE_COMMENTS,
  props<{ expandedNodeComments: NodeComment[]}>()
);