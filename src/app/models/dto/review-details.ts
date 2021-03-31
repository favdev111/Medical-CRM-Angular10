import { NodeComment } from "./node-comment";
import { Resource } from "./resource";

export class ReviewDetails implements Resource {
  id: number;
  reviewId: number;
  reviewUserId: number;
  nodeComments: NodeComment[];
  nodeCommentMap: Map<number, number[]>;
}