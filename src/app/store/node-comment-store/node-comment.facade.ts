import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { State } from './node-comment.reducer';
import * as NodeCommentActions from './node-comment.actions';
import { selectAllNodeComments, selectExpandedNodeComments, selectNodeCommentMap } from './node-comment.selectors';
import { NodeComment } from 'src/app/models/dto/node-comment';
import { take } from 'rxjs/operators';

@Injectable()
export class NodeCommentFacade {

  readonly nodeCommentMap$: Observable<Map<number, number[]>> = this.store.pipe(
    select(selectNodeCommentMap)
  );

  readonly nodeComments$: Observable<NodeComment[]> = this.store.pipe(
    select(selectAllNodeComments)
  );

  readonly expandedNodeComments$: Observable<NodeComment[]> = this.store.pipe(
    select(selectExpandedNodeComments)
  );

  constructor(private readonly store: Store<State>) {}

  public load(reviewId: number): void {
    this.store.dispatch(NodeCommentActions.load({ reviewId }));
  }

  public updateStatus(payload: NodeComment): void {
    this.store.dispatch(NodeCommentActions.updateStatus(payload));
  }

  public resetNodeComments(): void {
    this.store.dispatch(NodeCommentActions.resetNodeComments());
  }

  public setExpandedComments(nodeCommentIds: number[] = []): void {
    this.nodeComments$
      .pipe(take(1))
      .subscribe((nodeComments) => {
        const expandedNodeComments = nodeComments.filter(nodeComment => nodeCommentIds.includes(nodeComment.nodeCommentId));
        this.store.dispatch(NodeCommentActions.setExpandedComments({expandedNodeComments}));
      })}
}