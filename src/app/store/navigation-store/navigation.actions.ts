import { createAction, props } from '@ngrx/store';
import { NavigationActionTypes } from './navigation.types';

export const togglePreviewMode = createAction(
  NavigationActionTypes.TOGGLE_PREVIEW_MODE
);

export const toggleSidenav = createAction(
  NavigationActionTypes.TOGGLE_SIDENAV
);

export const setIsReviewMode = createAction(
  NavigationActionTypes.SET_REVIEW_MODE,
  props<{ isReviewMode: boolean }>()
);

export const resetNavigationToDefaults = createAction(
  NavigationActionTypes.RESET_NAVIGATION,
);

export const setIsStandAloneMode = createAction(
  NavigationActionTypes.SET_STAND_ALONE_MODE,
  props<{ isStandAloneMode: boolean }>()
);