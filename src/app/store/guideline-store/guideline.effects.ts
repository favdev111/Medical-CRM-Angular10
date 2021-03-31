import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, catchError, map, mergeMap, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { GuidelineService } from '../../services/guideline.service';
import { GuidelineListService } from '../../services/guideline-list.service';
import { GuidelineVersionService } from '../../services/guideline-version.service';
import * as GuidelineActions from './guideline.actions';
import * as NodeActions from '../node-store/node.actions';
import * as TableItemActions from '../table-item-store/table-item.actions';
import * as NavigationActions from '../navigation-store/navigation.actions';
import { Guideline } from '../../models/dto/guideline';
import { GuidelineListData } from '../../models/business/guideline-list-data';
import {
  GuidelineCreatePayload,
  GuidelineLoadPayload,
  GuidelineVersionDeletePayload,
  GuidelineLoadSucceededPayload,
  GuidelineStatusChangePayload
} from './guideline.types';
import { APIResponse } from 'src/app/models/http';
import { GCT_APP_VERSION } from 'src/app/constants';
import { isDraftStatus } from 'src/app/models/enums/guideline-status';


@Injectable()
export class GuidelineEffects {
  constructor(
    private guidelineService: GuidelineService,
    private guidelineListService: GuidelineListService,
    private guidelineVersionService: GuidelineVersionService,
    private actions$: Actions) { }

  createGuideline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.create),
      switchMap((payload: GuidelineCreatePayload) =>
        this.guidelineService.create(payload.guideline)
          .pipe(
            map((guideline: Guideline) => GuidelineActions.loadAll()),
            catchError((errors: any) => of(GuidelineActions.createFailed({ errors })))
          )
      )
    )
  );

  loadGuideline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.load),
      switchMap((payload: GuidelineLoadPayload) =>
        this.guidelineService.getById(payload.id)
          .pipe(
            map((guideline: Guideline) => GuidelineActions.loadSucceeded({ guideline })),
            catchError((errors: any) => of(GuidelineActions.loadFailed({ errors })))
          )
      )
    )
  );

  loadGuidelineSucceeded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.loadSucceeded),
      mergeMap((payload: GuidelineLoadSucceededPayload) => {
        const isReviewMode = !isDraftStatus(payload.guideline.status);
        return [
          NavigationActions.setIsReviewMode({ isReviewMode }),
          NodeActions.loadNodeMapSucceeded({ nodeMap: payload.guideline.nodeMap }),
          TableItemActions.loadSucceeded({ tableItems: payload.guideline.tableItems })
        ];
      })
    )
  );

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.loadAll),
      switchMap(() =>
        this.guidelineListService.loadGuidelineTypes()
          .pipe(
            mergeMap((res: APIResponse) => {
              const guidelineListData = res.object as GuidelineListData[];
              const appVersion = res.version.replace('(@git.commit.id.abbrev@)', '');
              localStorage.setItem(GCT_APP_VERSION, appVersion);
              return [GuidelineActions.loadGuidelineListDataSucceeded({ guidelineListData }), GuidelineActions.setAppVersion({ appVersion })];
            }),
            catchError((errors: any) => of(GuidelineActions.loadFailed({ errors })))
          )
      )
    )
  );


  deleteGuidelineVersion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.deleteGuidelineVersion),
      switchMap((payload: GuidelineVersionDeletePayload) =>
        this.guidelineVersionService.delete(payload.guidelineVersionId)
          .pipe(
            map(() => {
              GuidelineActions.deleteGuidelineVersionSucceeded();
              return GuidelineActions.loadAll();
            }),
            catchError((errors: any) => of(GuidelineActions.deleteGuidelineVersionFailed({ errors })))
          )
      )
    )
  );

  updateGuidelineStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.updateGuidelineStatus),
      switchMap((payload: GuidelineStatusChangePayload) =>
        this.guidelineService.updateGuidelineStatus(payload.guidelineVersionId, payload.changeDto)
          .pipe(
            map(() => GuidelineActions.updateGuidelineStatusSucceeded({ ...payload })),
            catchError((errors: any) => {
              return of(GuidelineActions.updateGuidelineStatusFailed({ errors }));
            })
          )
      )
    )
  );
}
