import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, withLatestFrom, mergeMap } from 'rxjs/operators';

import { TableItemService } from 'src/app/services/table-item.service';
import { RemovePayload, UpdatePayload, mapToTableItemUpdates, mapToNodeUpdates } from '../shared';
import * as TableItemActions from './table-item.actions';
import * as NodeActions from 'src/app/store/node-store/node.actions';
import { TableItemCreatePayload, TableItemReorderPayload, UpdatedTableItemPayload } from './table-item.types';
import { TableItem, TableItemNodeRelationship } from 'src/app/models/dto/table-item';


@Injectable()
export class TableItemEffects {

  constructor(private tableItemService: TableItemService, private actions$: Actions) { }

  createStartingPoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TableItemActions.create),
      switchMap((payload: TableItemCreatePayload) =>
        this.tableItemService.createStartingPoint(payload.tableItem)
          .pipe(
            map((updatePayload: UpdatedTableItemPayload) => {
              return TableItemActions.createSucceeded({ tableItems: updatePayload.updatedTableItems })
            }),
            catchError((errors: any) => of(TableItemActions.createFailed({ errors })))
          )
      )
    )
  );

  updateStartingPoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TableItemActions.update),
      switchMap((payload: UpdatePayload<TableItem>) =>
        this.tableItemService.updateStartingPoint(payload.changes)
          .pipe(
            map((updatePayload: UpdatedTableItemPayload) => {
              return TableItemActions.updateSucceeded({ tableItems: mapToTableItemUpdates(updatePayload.updatedTableItems) })
            }),
            catchError((errors: any) => of(TableItemActions.updateFailed({ errors })))
          )
      )
    )
  );

  removeStartingPoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TableItemActions.remove),
      switchMap((payload: RemovePayload) =>
        this.tableItemService.delete(payload.id)
          .pipe(
            mergeMap((updatePayload: UpdatedTableItemPayload) => {
              return [
                NodeActions.updateManySucceeded({ updatedNodes: mapToNodeUpdates(updatePayload.updatedNodes)}),
                TableItemActions.removeSucceeded({ id: payload.id })
              ];
            }),
            catchError((errors: any) => of(TableItemActions.removeFailed({ errors })))
          )
      )
    )
  );

  addNodeToStartingPoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TableItemActions.addNode),
      switchMap((payload: TableItemNodeRelationship) =>
        this.tableItemService.addNodeToStartingPoint(payload)
          .pipe(
            mergeMap((updatePayload: UpdatedTableItemPayload) => {
              return [
                TableItemActions.addNodeSucceeded({ tableItems: mapToTableItemUpdates(updatePayload.updatedTableItems) }),
                NodeActions.updateManySucceeded({ updatedNodes: mapToNodeUpdates(updatePayload.updatedNodes)})
              ];
            }),
            catchError((errors: any) => of(TableItemActions.addNodeFailed({ errors })))
          )
      )
    )
  );

  reorderStartingPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TableItemActions.reorder),
      switchMap((payload: TableItemReorderPayload) =>
        this.tableItemService.reorder(payload.tableItem)
          .pipe(
            map((tableItems) => TableItemActions.reorderSuccess({ tableItems: mapToTableItemUpdates(tableItems) })),
            catchError((errors: any) => of(TableItemActions.addNodeFailed({ errors })))
          )
      )
    )
  );
}



