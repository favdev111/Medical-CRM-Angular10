import { TableItem } from 'src/app/models/dto/table-item';
import { Node } from 'src/app/models/dto/node';

export interface ErrorPayload {
  errors: string | string[];
}

export interface UpdatePayload<T> {
  id: number;
  changes: T;
}

export interface RemovePayload {
  id: number;
}

export interface RemoveManyPayload {
  ids: number[];
}

export const mapToTableItemUpdates = (tableItems: TableItem[]): UpdatePayload<TableItem>[] => tableItems.map(tableItem => ({ id: tableItem.id, changes: tableItem }));
export const mapToNodeUpdates = (updatedNodes: Node[]) => updatedNodes.map(node => ({id: node.id, changes: node }));
