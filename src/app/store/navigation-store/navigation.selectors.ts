import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNavigation from './navigation.reducer';

const getNavigationState = createFeatureSelector<fromNavigation.State>(
  fromNavigation.navigationFeatureKey
);

export const selectIsPreviewMode = createSelector(
  getNavigationState,
  state => state.isPreviewMode
);

export const selectIsSidenavOpen = createSelector(
  getNavigationState,
  state => state.isSidenavOpen
);

export const selectIsReviewMode = createSelector(
  getNavigationState,
  state => state.isReviewMode
);

export const selectIsStandAloneMode = createSelector(
  getNavigationState,
  state => state.isStandAloneMode
);