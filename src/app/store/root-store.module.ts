import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { effects } from './effects';
import { reducer as nodeReducer, nodeFeatureKey } from './node-store/node.reducer';
import { reducer as userProfileReducer, userProfileFeatureKey } from './user-profile-store/userprofile.reducer';
import { reducer as guidelineReducer, guidelineFeatureKey } from './guideline-store/guideline.reducer';
import { reducer as tableItemReducer, tableItemFeatureKey } from './table-item-store/table-item.reducer';
import { reducer as navigationReducer, navigationFeatureKey } from './navigation-store/navigation.reducer';
import { reducer as nodeCommentReducer, nodeCommentFeatureKey } from './node-comment-store/node-comment.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(nodeFeatureKey, nodeReducer),
    StoreModule.forFeature(guidelineFeatureKey, guidelineReducer),
    StoreModule.forFeature(tableItemFeatureKey, tableItemReducer),
    StoreModule.forFeature(userProfileFeatureKey, userProfileReducer),
    StoreModule.forFeature(navigationFeatureKey, navigationReducer),
    StoreModule.forFeature(nodeCommentFeatureKey, nodeCommentReducer),
    EffectsModule.forFeature(effects)
  ],
  exports: [StoreModule, EffectsModule],
  declarations: []
})
export class RootStoreModule { }

