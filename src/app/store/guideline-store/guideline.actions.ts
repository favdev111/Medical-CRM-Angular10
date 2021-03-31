import { createAction, props } from '@ngrx/store';

import { Guideline } from '../../models/dto/guideline';
import { GuidelineActionTypes, GuidelineStatusChangePayload } from './guideline.types';
import { GuidelineType } from '../../models/dto/guideline-type';
import { GuidelineListData } from '../../models/business/guideline-list-data';
import { ErrorPayload } from '../shared';

export const create = createAction(
  GuidelineActionTypes.CREATE,
  props<{ guideline: Guideline }>()
);

export const createSucceeded = createAction(
  GuidelineActionTypes.CREATE_SUCCESS,
  props<{ guideline: Guideline }>()
);

export const createFailed = createAction(
  GuidelineActionTypes.CREATE_FAILURE,
  props<ErrorPayload>()
);

export const load = createAction(
  GuidelineActionTypes.LOAD,
  props<{ id: number }>()
);

export const loadSucceeded = createAction(
  GuidelineActionTypes.LOAD_SUCCESS,
  props<{ guideline: Guideline }>()
);

export const loadFailed = createAction(
  GuidelineActionTypes.LOAD_FAILURE,
  props<ErrorPayload>()
);

export const loadAll = createAction(
  GuidelineActionTypes.LOAD_ALL
);

export const loadAllSucceeded = createAction(
  GuidelineActionTypes.LOAD_ALL_SUCCESS,
  props<{ entities: Guideline[] }>()
);

export const loadAllFailed = createAction(
  GuidelineActionTypes.LOAD_ALL_FAILURE,
  props<ErrorPayload>()
);

export const loadAllGuidelineVersions = createAction(
  GuidelineActionTypes.LOAD_ALL_GUIDELINE_VERSIONS,
  props<{ guidelineTypes: GuidelineType[] }>()
);

export const loadGuidelineListDataSucceeded = createAction(
  GuidelineActionTypes.LOAD_ALL_GUIDELINE_DATA_SUCCESS,
  props<{ guidelineListData: GuidelineListData[] }>()
);

export const deleteGuidelineVersion = createAction(
  GuidelineActionTypes.DELETE_GUIDELINE_VERSION,
  props<{ guidelineVersionId: number }>()
);

export const deleteGuidelineVersionSucceeded = createAction(
  GuidelineActionTypes.DELETE_GUIDELINE_VERSION_SUCCESS
);

export const deleteGuidelineVersionFailed = createAction(
  GuidelineActionTypes.DELETE_GUIDELINE_VERSION_FAILURE,
  props<ErrorPayload>()
);

export const setAppVersion = createAction(
  GuidelineActionTypes.SET_APP_VERSION,
  props<{ appVersion: string }>()
);

export const updateGuidelineStatus = createAction(
  GuidelineActionTypes.UPDATE_GUIDELINE_STATUS,
  props<GuidelineStatusChangePayload>()
);

export const updateGuidelineStatusSucceeded = createAction(
  GuidelineActionTypes.UPDATE_GUIDELINE_STATUS_SUCCESS,
  props<GuidelineStatusChangePayload>()
);

export const updateGuidelineStatusFailed = createAction(
  GuidelineActionTypes.UPDATE_GUIDELINE_STATUS_FAILURE,
  props<ErrorPayload>()
);
