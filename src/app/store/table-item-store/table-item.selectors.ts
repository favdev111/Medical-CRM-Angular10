import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TableItem } from 'src/app/models/dto/table-item';
import * as fromTableItem from './table-item.reducer';

const getTableItemState = createFeatureSelector<fromTableItem.State>(
  fromTableItem.tableItemFeatureKey
);

const { selectAll } = fromTableItem.adapter.getSelectors();

export const selectTableItems = createSelector(
  getTableItemState,
  state => selectAll(state).sort((a: TableItem, b: TableItem) => a.pageNumber - b.pageNumber)
);

export const selectAllStartingPointNodeIds =
  createSelector(getTableItemState, (state) => {
    return {
      ids: [].concat(...selectAll(state).map(e => e.nodeIds).filter(Boolean))
    };
});

export const selectTableItemErrors = createSelector(
  getTableItemState,
  state => state.errors
);

export const selectTableItemComponentViewModel = createSelector(
  selectTableItems,
  selectTableItemErrors,
  (tableItems, errors) => ({
    tableItems,
    errors
  })
);
