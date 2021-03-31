import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';

import { GuidelineEffects } from './guideline.effects';
import { GuidelineService } from 'src/app/services/guideline.service';
import { GuidelineListService } from 'src/app/services/guideline-list.service';
import { GuidelineVersionService } from 'src/app/services/guideline-version.service';
import { createGuidelineA, createGuidelineB } from 'src/app/test-utils/dto-factory';
import { create, createSucceeded, deleteGuidelineVersion, deleteGuidelineVersionSucceeded, loadAll, loadAllSucceeded, loadGuidelineListDataSucceeded, setAppVersion } from './guideline.actions';
import { GuidelineListData } from 'src/app/models/business/guideline-list-data';
import { APIResponse } from 'src/app/models/http';

describe('GuidelineEffects', () => {
  let actions$: Observable<any>;
  let effects$: GuidelineEffects;
  let guidelineService: jasmine.SpyObj<GuidelineService>;
  let guidelineListService: jasmine.SpyObj<GuidelineListService>;
  let guidelineVersionService: jasmine.SpyObj<GuidelineVersionService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GuidelineEffects,
        provideMockActions(() => actions$),
        {
          provide: GuidelineService,
          useValue: {
            create: jasmine.createSpy(),
            getById: jasmine.createSpy(),
          }
        },
        {
          provide: GuidelineListService,
          useValue: {
            loadGuidelineTypes: jasmine.createSpy()
          }
        },
        {
          provide: GuidelineVersionService,
          useValue: {
            delete: jasmine.createSpy()
          }
        }
      ]
    });

    effects$ = TestBed.inject(GuidelineEffects);
    guidelineService = TestBed.get(GuidelineService);
    guidelineListService = TestBed.get(GuidelineListService);
    guidelineVersionService = TestBed.get(GuidelineVersionService);
  });

  describe('create and delete', () => {
    it('should create guideline successfully', () => {
      const guideline = createGuidelineA();
      const action = create({ guideline });
      const outcome = loadAll();

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: guideline });
      guidelineService.create.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.createGuideline$).toBeObservable(expected);
    });

    it('should delete guideline successfully', () => {
      const guideline = createGuidelineA();
      const action = deleteGuidelineVersion({ guidelineVersionId: guideline.guidelineVersion.id });
      const outcome = loadAll();

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: of(null) });
      guidelineVersionService.delete.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.deleteGuidelineVersion$).toBeObservable(expected);
    });
  });

  describe('loading', () => {
    it('should load all guideline list data', () => {
      const guideline = createGuidelineA();
      const latestGuideline = createGuidelineB();
      const guidelineListData: GuidelineListData[] = [
        { 
          id: null,
          guidelineType: guideline.guidelineVersion.guidelineType,
          latestVersion: latestGuideline.guidelineVersion,
          guidelineVersions: [guideline.guidelineVersion, latestGuideline.guidelineVersion]
        }
      ];

      const expectedReturnValue: APIResponse = {
          object: guidelineListData,
          status: '200',
          apiErrors: [],
          apiWarnings: [],
          timestamp: new Date(),
          version: 'version'
      };

      const action = loadAll();
      const outcome = [loadGuidelineListDataSucceeded({ guidelineListData }), setAppVersion({ appVersion: 'version'})];

      actions$ = hot('-a', { a: action })
      const response = cold('-a|', { a: expectedReturnValue });
      guidelineListService.loadGuidelineTypes.and.returnValue(response);

      const expected = cold('--(bc)', { b: outcome[0], c: outcome[1] });
      expect(effects$.loadAll$).toBeObservable(expected);
    });
  });

});