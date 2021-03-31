import { createAction, props } from '@ngrx/store';
import { UserProfile } from 'src/app/models/business/user-profile';
import { UserProfileActionTypes } from './userprofiles.types';

export const setUserProfile = createAction(
  UserProfileActionTypes.SET_USER_PROFILE,
  props<UserProfile>()
);

