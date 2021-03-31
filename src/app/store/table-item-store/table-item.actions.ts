import { createAction, props } from '@ngrx/store';

import { TableItem } from 'src/app/models/dto/table-item';
import {
  TableItemActionTypes,
  TableItemCreatePayload,
  TableItemAddNodePayload,
  TableItemReorderPayload,
  TableItemUpdateMultiplePayload
} from './table-item.types';
import { ErrorPayload, UpdatePayload, RemovePayload } from '../shared';

export const loadSucceeded = createAction(
  TableItemActionTypes.LOAD_SUCCEEDED,
  props<{ tableItems: TableItem[] }>()
);

export const create = createAction(
  TableItemActionTypes.CREATE,
  props<TableItemCreatePayload>()
);

export const createSucceeded = createAction(
  TableItemActionTypes.CREATE_SUCCESS,
  props<{ tableItems: TableItem[]}>()
);

export const createFailed = createAction(
  TableItemActionTypes.CREATE_FAILURE,
  props<ErrorPayload>()
);

export const update = createAction(
  TableItemActionTypes.UPDATE,
  props<UpdatePayload<TableItem>>()
);

export const updateSucceeded = createAction(
  TableItemActionTypes.UPDATE_SUCCESS,
  props<TableItemUpdateMultiplePayload>()
);

export const updateFailed = createAction(
  TableItemActionTypes.UPDATE_FAILURE,
  props<ErrorPayload>()
);

export const remove = createAction(
  TableItemActionTypes.REMOVE,
  props<RemovePayload>()
);

export const removeSucceeded = createAction(
  TableItemActionTypes.REMOVE_SUCCESS,
  props<RemovePayload>()
);

export const removeFailed = createAction(
  TableItemActionTypes.REMOVE_FAILURE,
  props<ErrorPayload>()
);

export const addNode = createAction(
  TableItemActionTypes.ADD_NODE,
  props<TableItemAddNodePayload>()
);

export const addNodeSucceeded = createAction(
  TableItemActionTypes.ADD_NODE_SUCCESS,
  props<TableItemUpdateMultiplePayload>()
);

export const addNodeFailed = createAction(
  TableItemActionTypes.ADD_NODE_FAILURE,
  props<ErrorPayload>()
);

export const reorder = createAction(
  TableItemActionTypes.REORDER,
  props<TableItemReorderPayload>()
);

export const reorderSuccess = createAction(
  TableItemActionTypes.REORDER_SUCCESS,
  props<TableItemUpdateMultiplePayload>()
);

export const reorderFailed = createAction(
  TableItemActionTypes.REORDER_FAILURE,
  props<ErrorPayload>()
);

