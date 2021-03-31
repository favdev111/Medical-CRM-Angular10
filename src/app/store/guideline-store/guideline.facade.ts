import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { State } from './guideline.reducer';
import * as GuidelineActions from './guideline.actions';
import { selectActiveGuidelineTypeId, selectActiveGuidelineVersionId, selectCurrentGuidelineStatus, selectGuidelineIsLoading, selectGuidelineListData } from './guideline.selectors';
import { Guideline } from 'src/app/models/dto/guideline';
import { GuidelineListData } from 'src/app/models/business/guideline-list-data';
import { GuidelineStatus } from 'src/app/models/enums/guideline-status';

@Injectable()
export class GuidelineFacade {

  readonly activeGuidelineTypeId$: Observable<number> = this.store.pipe(
    select(selectActiveGuidelineTypeId)
  );

  readonly activeGuidelineVersionId$: Observable<number> = this.store.pipe(
    select(selectActiveGuidelineVersionId)
  );

  readonly isLoading$: Observable<boolean> = this.store.pipe(
    select(selectGuidelineIsLoading)
  );

  readonly guidelineListData$: Observable<GuidelineListData[]> = this.store.pipe(
    select(selectGuidelineListData)
  )

  readonly currentGuidelineStatus: Observable<GuidelineStatus> = this.store.pipe(
    select(selectCurrentGuidelineStatus)
  )

  constructor(private readonly store: Store<State>) {}

  public load(guidelineId: number): void {
    this.store.dispatch(GuidelineActions.load({id: guidelineId}));
  }

  public create(guideline: Guideline): void {
    this.store.dispatch(GuidelineActions.create({guideline}))
  }

  public deleteGuidelineVersion(guidelineVersionId: number): void {
    this.store.dispatch(GuidelineActions.deleteGuidelineVersion({ guidelineVersionId }));
  }
}