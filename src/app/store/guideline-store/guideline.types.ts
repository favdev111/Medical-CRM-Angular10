import { GuidelineStatusChange } from 'src/app/models/dto/guideline-status-change';
import { Guideline } from '../../models/dto/guideline';

export const enum GuidelineActionTypes {
  LOAD = '[Guidelines] Load',
  LOAD_SUCCESS = '[Guidelines] Load Success',
  LOAD_FAILURE = '[Guidelines] Load Failure',
  LOAD_ALL = '[Guidelines] Load All',
  LOAD_ALL_SUCCESS = '[Guidelines] Load All Success',
  LOAD_ALL_FAILURE = '[Guidelines] Load All Failure',
  LOAD_ALL_GUIDELINE_VERSIONS = '[Guideline Versions] Load All',
  LOAD_ALL_GUIDELINE_DATA_SUCCESS = '[Guideline Data] Load All Success',
  CREATE = '[Guidelines] Create',
  CREATE_SUCCESS = '[Guidelines] Create Success',
  CREATE_FAILURE = '[Guidelines] Create Failure',
  DELETE_GUIDELINE_VERSION = '[Guideline Version] Delete',
  DELETE_GUIDELINE_VERSION_SUCCESS = '[Guideline Version] Delete Success',
  DELETE_GUIDELINE_VERSION_FAILURE = '[Guideline Version] Delete Failure',
  LOAD_APP_VERSION = '[Guidelines] Load APP VERSION',
  LOAD_APP_VERSION_SUCCESS = '[Guidelines] Load APP VERSION Success',
  LOAD_APP_VERSION_FAILURE = '[Guidelines] Load APP VERSION Failure',
  SET_APP_VERSION = '[Guidelines] Set App Version',
  UPDATE_GUIDELINE_STATUS = '[Guidelines] Update Guideline Status',
  UPDATE_GUIDELINE_STATUS_SUCCESS = '[Guidelines] Update Guideline Status Success',
  UPDATE_GUIDELINE_STATUS_FAILURE = '[Guidelines] Update Guideline Status Failure'
}

export interface GuidelineLoadPayload {
  id: number;
}

export interface GuidelineCreatePayload {
  guideline: Guideline;
}

export interface GuidelineLoadSucceededPayload {
  guideline: Guideline;
}

export interface GuidelineLoadAllPayload {
  guidelines: Guideline[];
}

export interface GuidelineVersionDeletePayload {
  guidelineVersionId: number;
}

export interface GuidelineStatusChangePayload {
  guidelineVersionId: number;
  changeDto: GuidelineStatusChange;
  guidelineTypeId: number;
}


