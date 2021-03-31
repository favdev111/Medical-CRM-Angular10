import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GuidelineStatus } from 'src/app/models/enums/guideline-status';
import * as fromGuideline from './guideline.reducer';

const getGuidelineState = createFeatureSelector<fromGuideline.State>(
  fromGuideline.guidelineFeatureKey
);

export const selectGuidelineIsLoading = createSelector(
  getGuidelineState,
  state => state.isLoading
);

export const selectGuidelineErrors = createSelector(
  getGuidelineState,
  state => state.errors
);

export const selectGuidelineListData = createSelector(
  getGuidelineState,
  state => state.guidelineListData
);

export const selectAppVersion = createSelector(
  getGuidelineState,
  state => state.appVersion
);

export const selectActiveGuideline = createSelector(
  getGuidelineState,
  state => state.guideline
);

export const selectCurrentGuidelineStatus = createSelector(
  getGuidelineState,
  state => state.guideline ? state.guideline.status : null
);

export const selectActiveGuidelineTypeId = createSelector(
  getGuidelineState,
  state => state.guideline?.guidelineVersion.guidelineTypeId
);

export const selectActiveGuidelineVersionId = createSelector(
  getGuidelineState,
  state => state.guideline?.guidelineVersion.id
)

export const selectLatestReviewId = createSelector(
  getGuidelineState,
  state => (state.guideline?.guidelineVersion?.latestReview 
    && state.guideline.status !== GuidelineStatus.PUBLISHED)
    ? state.guideline.guidelineVersion.latestReview.reviewId 
    : null
);

export const selectFeature = (state: fromGuideline.State) => state.entities;