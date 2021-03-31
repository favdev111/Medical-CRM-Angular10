import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { TableItem } from 'src/app/models/dto/table-item';
import * as TableItemActions from './table-item.actions';

export interface State extends EntityState<TableItem> {
  errors: string | string[];
}

export const adapter: EntityAdapter<TableItem> = createEntityAdapter<TableItem>();

export const initialState: State = {
  ...adapter.getInitialState(),
  errors: []
};

export const tableItemFeatureKey = 'tableItem';

const tableItemReducer = createReducer(
  initialState,
  on(
    TableItemActions.loadSucceeded,
    (state, { tableItems }) => adapter.setAll(tableItems, state)
  ),
  on(
    TableItemActions.createSucceeded,
    (state, { tableItems }) => adapter.upsertMany(tableItems, state)
  ),
  on(
    TableItemActions.removeSucceeded,
    (state, { id }) => adapter.removeOne(id, state)
  ),
  on(
    TableItemActions.reorderSuccess,
    TableItemActions.addNodeSucceeded,
    TableItemActions.updateSucceeded,
    (state, { tableItems }) => adapter.updateMany(tableItems, state)
  ),
  on(
    TableItemActions.createFailed,
    TableItemActions.removeFailed,
    TableItemActions.updateFailed,
    TableItemActions.addNodeFailed,
    TableItemActions.reorderFailed,
    (state, { errors }) => ({ ...state, errors })
  )
);

export const reducer = (state: State | undefined, action: Action) => tableItemReducer(state, action);
