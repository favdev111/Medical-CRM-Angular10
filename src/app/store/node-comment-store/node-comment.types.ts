import { NodeCommentStatus } from "src/app/models/enums/node-comment-status";

export const enum NodeCommentActionTypes {
  LOAD = '[Comments] Load',
  LOAD_SUCCESS = '[Comments] Load Success',
  LOAD_FAILURE = '[Comments] Load Failure',
  UPDATE_STATUS = '[Comments] Update Status',
  UPDATE_STATUS_SUCCESS = '[Comments] Update Status Success',
  UPDATE_STATUS_FAILURE = '[Comments] Update Status Failure',
  RESET_NODE_COMMENTS = '[Comments] Reset Node Comments',
  SET_EXPANDED_NODE_COMMENTS = '[Comments] Set Expanded Node Comments'
}

export interface UpdateNodeCommentStatusPayload {
  reviewId: number;
  nodeCommentId: number;
  status: NodeCommentStatus;
}

export interface LoadNodeCommentPayload {
  reviewId: number;
}