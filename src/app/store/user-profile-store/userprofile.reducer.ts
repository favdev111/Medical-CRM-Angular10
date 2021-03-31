import { createReducer, on, Action } from '@ngrx/store';
import { UserProfile } from 'src/app/models/business/user-profile';
import * as UserProfileActions from './userprofile.actions';

export interface State extends UserProfile {
  username: string;
  displayName: string;
}

export const initialState: State = {
  username: '',
  displayName: '',
};

export const userProfileFeatureKey = 'user';

const userProfileReducer = createReducer(
  initialState,
  on(UserProfileActions.setUserProfile, (state, { username, displayName }) => ({ ...state, username, displayName }))
);

export const reducer = (state: State | undefined, action: Action) =>
  userProfileReducer(state, action);
