import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';

import { CreateGuidelineComponent, CreateGuidelineDialogComponent } from './create-guideline/create-guideline.component';
import { GuidelineListComponent } from './guideline-list/guideline-list.component';
import { SharedModule } from '../../shared/shared.module';
import { GCTFileManagementComponent } from './gct-file-management.component';
import { GCTFileManagementRoutingModule } from './gct-file-management-routing.module';
import { GuidelineVersionListComponent } from './guideline-list/guideline-version-list/guideline-version-list.component';
import { GuidelineStatusPipe } from './guideline-list/pipes/guideline-status.pipe';
import { ReviewStatusPipe } from './guideline-list/pipes/review-status.pipe';
import { GuidelineStatusCirclePipe } from './guideline-list/pipes/guideline-status-circle.pipe';
import { ApprovedReviewCount } from './guideline-list/pipes/approved-review-count.pipe';
import { ProgressPercentage } from './guideline-list/pipes/progress-percentage.pipe';
import { ShowStatusDetailPipe } from './guideline-list/pipes/show-detail-status.pipe';
import { GuidelineActionStatus } from './guideline-list/pipes/guideline-action.pipe';

const components = [
  CreateGuidelineComponent,
  CreateGuidelineDialogComponent,
  GuidelineListComponent,
  GCTFileManagementComponent,
  GuidelineVersionListComponent
];

const pipes = [
  GuidelineStatusPipe,
  ReviewStatusPipe,
  GuidelineStatusCirclePipe,
  ApprovedReviewCount,
  ProgressPercentage,
  ShowStatusDetailPipe,
  GuidelineActionStatus
];

@NgModule({
  declarations: [
    ...components,
    ...pipes
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatSortModule,
    GCTFileManagementRoutingModule
  ],
  exports: [
    ...components
  ]
})
export class GCTFileManagementModule { }
