import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { NodeComment } from "src/app/models/dto/node-comment";
import { ReviewDetails } from "src/app/models/dto/review-details";

import { NodeCommentService } from 'src/app/services/node-comment.service';
import { ErrorPayload } from "../shared";
import * as NodeCommentActions from './node-comment.actions'
import { LoadNodeCommentPayload, UpdateNodeCommentStatusPayload } from "./node-comment.types";

@Injectable()
export class NodeCommentEffects {
  
  constructor(private nodeCommentService: NodeCommentService, private actions$: Actions) { }

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeCommentActions.load),
      switchMap((payload: LoadNodeCommentPayload) =>
        this.nodeCommentService.loadByGuidelineVersionId(payload.reviewId)
          .pipe(
            map((reviewDetails: ReviewDetails) => NodeCommentActions.loadSucceeded({ reviewDetails })),
            catchError((errors: ErrorPayload) => of(NodeCommentActions.loadFailed(errors)))
          )
      )
    )
  )

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeCommentActions.updateStatus),
      switchMap((payload: NodeComment) =>
        this.nodeCommentService.updateNodeCommentStatus({ nodeCommentId: payload.nodeCommentId, reviewId: payload.reviewId, status: payload.status })
          .pipe(
            map(() => NodeCommentActions.updateStatusSucceeded({ nodeCommentId: payload.nodeCommentId, changes: { ...payload } })),
            catchError((errors: ErrorPayload) => of(NodeCommentActions.updateStatusFailed(errors)))
          )
      )
    )
  )
}