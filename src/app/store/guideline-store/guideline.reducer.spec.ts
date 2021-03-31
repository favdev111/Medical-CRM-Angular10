import { reducer, State } from './guideline.reducer';
import * as GuidelineActions from './guideline.actions';
import { createGuidelineA, createGuidelineB } from '../../test-utils/dto-factory';
import { GuidelineListData } from 'src/app/models/business/guideline-list-data';


describe('GuidelineReducer', () => {
  let state: State;
  const initialState: State = {
    ids: [],
    entities: {},
    guideline: null,
    isLoading: false,
    errors: [],
    guidelineListData: [],
    appVersion: null
  };

  beforeEach(() => {
    // Tear down
    state = reducer(undefined, {} as any);
  });

  it('should have initial state', () => {
    expect(state).toEqual(initialState);
  });

  it('should handle create', () => {
    // given
    const guideline = createGuidelineA();
    state = reducer(state, GuidelineActions.createSucceeded({ guideline }));

    // expect
    expect(state.ids.length).toEqual(1);
    expect(state.guideline).toEqual(guideline);
  });

  it('should load', () => {
    // given
    const guidelineA = createGuidelineA();
    const guidelineB = createGuidelineB();
    state = reducer(state, GuidelineActions.createSucceeded({ guideline: guidelineA }));
    state = reducer(state, GuidelineActions.createSucceeded({ guideline: guidelineB }));
    state = reducer(state, GuidelineActions.loadSucceeded({ guideline: guidelineA }));

    // expect
    expect(state.guideline).toEqual(guidelineA);
  });

  it('should load guideline list data', () => {
    // given
    const guidelineA = createGuidelineA();
    const guidelineLatestVersion = createGuidelineB();
    const guidelineListData: GuidelineListData[] = [
      {
        id: null,
        guidelineType: guidelineA.guidelineVersion.guidelineType,
        latestVersion: guidelineLatestVersion.guidelineVersion,
        guidelineVersions: [guidelineA.guidelineVersion, guidelineLatestVersion.guidelineVersion]
      }
    ];

    state = reducer(state, GuidelineActions.createSucceeded({ guideline: guidelineA }));
    state = reducer(state, GuidelineActions.loadGuidelineListDataSucceeded({ guidelineListData }));

    // expect
    expect(state.guidelineListData).toEqual(guidelineListData);
  });

  it('should set app version', () => {
    // given
    const appVersion = 'version';

    state = reducer(state, GuidelineActions.setAppVersion({ appVersion }));

    // expect
    expect(state.appVersion).toEqual(appVersion);
  });
});
