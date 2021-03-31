import { TableItem } from 'src/app/models/dto/table-item';
import { Node } from 'src/app/models/dto/node';
import { UpdatePayload } from '../shared';

export enum TableItemActionTypes {
  LOAD_SUCCEEDED = '[TableItems] Load Succeeded',
  CREATE = '[TableItems] Create',
  CREATE_SUCCESS = '[TableItems] Create Success',
  CREATE_FAILURE = '[TableItems] Create Failure',
  UPDATE = '[TableItems] Update',
  UPDATE_SUCCESS = '[TableItems] Update Success',
  UPDATE_FAILURE = '[TableItems] Update Failure',
  REMOVE = '[TableItems] Remove',
  REMOVE_SUCCESS = '[TableItems] Remove Success',
  REMOVE_FAILURE = '[TableItems] Remove Failure',
  ADD_NODE = '[TableItems] Add Node',
  ADD_NODE_SUCCESS = '[TableItems] Add Node Success',
  ADD_NODE_FAILURE = '[TableItems] Add Node Failure',
  REORDER = '[TableItems] Reorder',
  REORDER_SUCCESS = '[TableItems] Reorder Success',
  REORDER_FAILURE = '[TableItems] Reorder Failure',
  REMOVE_NODE_FROM_STARTING_POINT = '[TableItems] Remove Node From Starting Point'
}

export interface TableItemCreatePayload {
  tableItem: TableItem;
}

export interface TableItemAddNodePayload {
  tableItemId: number;
  nodeId: number;
}

export interface TableItemReorderPayload {
  tableItem: TableItem;
}

export interface TableItemUpdateMultiplePayload {
  tableItems: UpdatePayload<TableItem>[];
}

export interface UpdatedTableItemPayload {
  updatedTableItems: TableItem[];
  updatedNodes: Node[];
}

