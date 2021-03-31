import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectIsPreviewMode, selectIsReviewMode, selectIsSidenavOpen, selectIsStandAloneMode } from './navigation.selectors';
import { State } from './navigation.reducer';
import * as NavigationActions from './navigation.actions';

@Injectable()
export class NavigationFacade {

  readonly isReviewMode$: Observable<boolean> = this.store.pipe(
    select(selectIsReviewMode)
  );

  readonly isPreviewMode$: Observable<boolean> = this.store.pipe(
    select(selectIsPreviewMode)
  );

  readonly isSidenavOpen$: Observable<boolean> = this.store.pipe(
    select(selectIsSidenavOpen)
  );

  readonly isStandAloneMode$: Observable<boolean> = this.store.pipe(
    select(selectIsStandAloneMode)
  );

  constructor(private readonly store: Store<State>) {}

  public toggleIsPreviewMode(): void {
    this.store.dispatch(NavigationActions.togglePreviewMode());
  }

  public toggleSidenav(): void {
    this.store.dispatch(NavigationActions.toggleSidenav());
  }

  public setIsReviewMode(isReviewMode: boolean): void {
    this.store.dispatch(NavigationActions.setIsReviewMode({ isReviewMode }));
  }

  public resetNavigationToDefaults(): void {
    this.store.dispatch(NavigationActions.resetNavigationToDefaults());
  }

  public setIsStandAloneMode(isStandAloneMode: boolean): void {
    this.store.dispatch(NavigationActions.setIsStandAloneMode({ isStandAloneMode }))
  }
}