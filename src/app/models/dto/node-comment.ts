import { NodeCommentStatus } from "../enums/node-comment-status";
import { Resource } from "./resource";

export class NodeComment implements Resource {
  id: number;
  nodeCommentId: number;
  reviewId: number;
  reviewUserId: number;
  content: string;
  userDisplayName: string;
  createdDate: Date;
  status: NodeCommentStatus;
}