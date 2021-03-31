import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BASE_REVIEW_URL } from "../constants";
import { NodeComment } from "../models/dto/node-comment";
import { ReviewDetails } from "../models/dto/review-details";
import { APIResponse } from "../models/http";
import { UpdateNodeCommentStatusPayload } from "../store/node-comment-store/node-comment.types";
import { ResourceBaseService } from "./resource-base.service";

@Injectable({
  providedIn: 'root'
})
export class NodeCommentService extends ResourceBaseService<ReviewDetails> {
  constructor(httpClient: HttpClient) {
    super(httpClient, BASE_REVIEW_URL);
  }

  loadByGuidelineVersionId(guidelineVersionId: number): Observable<ReviewDetails> {
    return this.httpClient
      .get(`${this.basePath}/${guidelineVersionId}`)
      .pipe(map((res: APIResponse) => this.toDto(res)))
  }

  updateNodeCommentStatus(payload: UpdateNodeCommentStatusPayload): Observable<NodeComment> {
    return this.httpClient
      .put(`${this.basePath}/${payload.reviewId}/comment/${payload.nodeCommentId}/status`, {status: payload.status})
      .pipe(map((res: APIResponse) => res.object as unknown as NodeComment));
  }
}