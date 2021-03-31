import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectUserDisplayName } from './userprofile.selectors';
import { State } from './userprofile.reducer';
import * as UserProfileActions from './userprofile.actions';
import { UserProfile } from 'src/app/models/business/user-profile';

@Injectable()
export class UserProfileFacade {

  readonly userDisplayName$: Observable<string> = this.store.pipe(
    select(selectUserDisplayName)
  );

  constructor(private readonly store: Store<State>) {}

  public setUserProfile(userProfile: UserProfile): void {
    this.store.dispatch(UserProfileActions.setUserProfile({...userProfile}));
  }
}