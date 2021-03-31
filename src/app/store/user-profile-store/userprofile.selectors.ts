import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUserProfile from './userprofile.reducer';

const getUserProfileState = createFeatureSelector<fromUserProfile.State>(
  fromUserProfile.userProfileFeatureKey
);

export const selectUserDisplayName = createSelector(
  getUserProfileState,
  state => state.displayName
);
