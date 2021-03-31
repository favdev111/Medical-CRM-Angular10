import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { NodeService } from '../../services/node.service';
import * as NodeActions from './node.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { NodeUpdatePayload, NodeCreatePayload } from './node.types';
import { NodeRelationship, NodeUpdate } from 'src/app/models/dto/node';
import { mapToNodeUpdates, RemovePayload } from '../shared';

@Injectable()
export class NodeEffects {
  constructor(private nodeService: NodeService, private actions$: Actions) { }

  createNode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeActions.create),
      switchMap((payload: NodeCreatePayload) =>
        this.nodeService.create(payload.node)
          .pipe(
            map(node => NodeActions.createSucceeded({ node })),
            catchError((errors: any) => of(NodeActions.createFailed({ errors })))
          )
      )
    )
  );

  updateNode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeActions.update),
      switchMap((payload: NodeUpdatePayload) =>
        this.nodeService.update(payload.changes)
          .pipe(
            map(node => NodeActions.updateSucceeded({ id: payload.id, changes: node })),
            catchError((errors: any) => of(NodeActions.updateFailed({ errors })))
          )
      )
    )
  );

  deleteNode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeActions.remove),
      switchMap((payload: RemovePayload) =>
        this.nodeService.delete(payload.id)
          .pipe(
            map((updatePayload: NodeUpdate) => {
              return NodeActions.removeSucceeded({ ids: updatePayload.deletedNodeIds });
            }),
            catchError((errors: any) => of(NodeActions.removeFailed({ errors })))
          )
      )
    )
  );

  createRelationship$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeActions.createRelationship),
      switchMap((payload: NodeRelationship) =>
        this.nodeService.createRelationship(payload)
          .pipe(
            map((updatePayload: NodeUpdate) => NodeActions.createRelationshipSucceeded({ ...updatePayload })),
            catchError((errors: any) => of(NodeActions.createRelationshipFailed({ errors })))
          )
      )
    )
  );

  deleteRelationship$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeActions.removeRelationship),
      switchMap((payload: NodeRelationship) =>
        this.nodeService.deleteRelationship(payload)
          .pipe(
            map((updatePayload: NodeUpdate) => {
              return NodeActions.removeRelationshipSucceeded({ ...updatePayload, updatedNodes: mapToNodeUpdates(updatePayload.updatedNodes) });
            }),
            catchError((errors: any) => of(NodeActions.removeRelationshipFailed({ errors })))
          )
      )
    )
  );
}
