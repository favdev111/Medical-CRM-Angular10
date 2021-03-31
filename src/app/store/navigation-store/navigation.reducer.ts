import { createReducer, on, Action } from '@ngrx/store';
import * as NavigationActions from './navigation.actions';

export interface State {
  isPreviewMode: boolean;
  isSidenavOpen: boolean;
  isReviewMode: boolean;
  isStandAloneMode: boolean;
}

export const initialState: State = {
  isPreviewMode: false,
  isSidenavOpen: true,
  isReviewMode: false,
  isStandAloneMode: false
};

export const navigationFeatureKey = 'navigation';

const navigationReducer = createReducer(
  initialState,
  on(NavigationActions.togglePreviewMode, (state) => {
    if (state.isPreviewMode && !state.isSidenavOpen) {
      return { ...state, isPreviewMode: false, isSidenavOpen: true };
    } else if (state.isPreviewMode && state.isSidenavOpen) {
      return { ...state, isPreviewMode: false };
    }
    return { ...state, isPreviewMode: !state.isPreviewMode, isSidenavOpen: false };
  }),
  on(NavigationActions.toggleSidenav, (state) => ({ ...state, isSidenavOpen: !state.isSidenavOpen })),
  on(NavigationActions.setIsReviewMode, (state, { isReviewMode }) => {
    if (isReviewMode && state.isSidenavOpen) {
      return { ...state, isReviewMode, isSidenavOpen: false };
    }
    return { ...state, isReviewMode }
  }),
  on(NavigationActions.resetNavigationToDefaults, (state) => ({ ...initialState, isStandAloneMode: state.isStandAloneMode })),
  on(NavigationActions.setIsStandAloneMode, (state, { isStandAloneMode }) => ({ ...state, isStandAloneMode }))
)

export const reducer = (state: State | undefined, action: Action) => navigationReducer(state, action);
