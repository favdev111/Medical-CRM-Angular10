import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { cloneDeep } from 'lodash';

import { Guideline } from '../../models/dto/guideline';
import * as GuidelineActions from './guideline.actions';
import { GuidelineListData } from '../../models/business/guideline-list-data';
import { GuidelineStatusChange } from 'src/app/models/dto/guideline-status-change';

export interface State extends EntityState<Guideline> {
  guideline: Guideline;
  guidelineListData: GuidelineListData[];
  appVersion: string;
  isLoading: boolean;
  errors: string | string[];
}

export const adapter: EntityAdapter<Guideline> = createEntityAdapter<Guideline>();
const initialState: State = {
  ...adapter.getInitialState(),
  guideline: null,
  guidelineListData: [],
  appVersion: null,
  isLoading: false,
  errors: []
};

export const guidelineFeatureKey = 'guideline';

const guidelineReducer = createReducer(
  initialState,
  on(
    GuidelineActions.createSucceeded,
    (state, { guideline }) => {
      state = { ...state, guideline };
      return adapter.addOne(guideline, state);
    }
  ),
  on(
    GuidelineActions.createFailed,
    GuidelineActions.loadFailed,
    GuidelineActions.loadAllFailed,
    GuidelineActions.deleteGuidelineVersionFailed,
    (state, { errors }) => ({ ...state, errors, isLoading: false })
  ),
  on(
    GuidelineActions.load,
    GuidelineActions.loadAll,
    (state) => ({ ...state, isLoading: true })
  ),
  on(
    GuidelineActions.loadSucceeded,
    (state, { guideline }) => ({ ...state, isLoading: false, guideline })
  ),
  on(
    GuidelineActions.loadAllSucceeded,
    (state, { entities }) => {
      state = { ...state, isLoading: false };
      return adapter.setAll(entities, state);
    }
  ),
  on(
    GuidelineActions.loadGuidelineListDataSucceeded,
    (state, { guidelineListData }) => (
      {
        ...state,
        isLoading: false,
        guidelineListData
      }
    )
  ),
  on(
    GuidelineActions.setAppVersion,
    (state, { appVersion }) => ({ ...state, isLoading: false, appVersion })
  ),
  on(
    GuidelineActions.updateGuidelineStatusSucceeded,
    (state, { guidelineVersionId, guidelineTypeId, changeDto }) => updateFileManagement(state, guidelineVersionId, guidelineTypeId, changeDto)
  )
);

const updateFileManagement = (state: State, guidelineVersionId: number, guidelineTypeId: number, changeDto: GuidelineStatusChange): State => {
      const guidelineListData = cloneDeep(state.guidelineListData);
      guidelineListData
        .filter(listData => listData.guidelineType.guidelineTypeId === guidelineTypeId)
        .map(listData => {
          listData.latestVersion.status = changeDto.status;
          listData.guidelineVersions.map(version => {
            if (version.id === guidelineVersionId) {
              version.status = changeDto.status;
            }
            return version;
          })
        });
      
      if (guidelineVersionId === state.guideline.guidelineVersion.id) {
        const guideline = { ...state.guideline };
        guideline.status = changeDto.status;

        return { ...state, guidelineListData, guideline };
      }
      return { ...state, guidelineListData };
}

export const reducer = (state: State | undefined, action: Action) => guidelineReducer(state, action);
