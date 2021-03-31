import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { ToolbarComponent } from '../components/layout/toolbar/toolbar.component';
import { SidebarComponent } from '../components/layout/sidebar/sidebar.component';
import { GraphComponent } from 'src/app/components/graph/graph.component';
import { UpdateStatusComponent } from 'src/app/components/guideline-status-change/update-status.component';
import { SendToReviewDialogComponent } from 'src/app/components/guideline-status-change/send-to-review-dialog/send-to-review-dialog.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { AlertComponent } from '../components/alert/alert.component';
import { TextEditorComponent } from '../components/gct-editor/text-editor/text-editor.component';
import { TableContentsComponent } from 'src/app/components/table-contents/table-contents.component';
import { TINYMCE_SCRIPT_SRC, EditorModule } from '@tinymce/tinymce-angular';
import { ListItemComponent } from 'src/app/components/table-contents/list-item/list-item.component';
import { TableContentsListComponent } from 'src/app/components/table-contents/table-contents-list/table-contents-list.component';
import { CreateStartingPointsComponent } from 'src/app/components/table-contents/create-starting-points/create-starting-points.component';
import { CreateStartingPointsDialogComponent } from 'src/app/components/table-contents/create-starting-points/create-starting-points-dialog/create-starting-points-dialog.component';
import { StartingPointComponent } from 'src/app/components/table-contents/list-item/starting-point/starting-point.component';
import { StartingPointsComponent } from 'src/app/components/table-contents/list-item/starting-points/starting-points.component';
import { AlertService } from '../services/alert.service';
import { FooterComponent } from '../components/layout/footer/footer.component';
import { IsGuidelineStatusPipe } from '../components/guideline-status-change/pipes/is-guideline-status.pipe';
import { UpdateStatusDialogService } from '../components/guideline-status-change/services/update-status-dialog.service';
import { NavigationFacade } from 'src/app/store/navigation-store/navigation.facade';
import { ResponsiveNavbarComponent } from '../components/layout/responsive-navbar/responsive-navbar.component';
import { ExitAppComponent } from '../components/layout/exit-app/exit-app.component';
import { UserProfileFacade } from 'src/app/store/user-profile-store/userprofile.facade';
import { NodeCommentFacade } from 'src/app/store/node-comment-store/node-comment.facade';
import { GuidelineFacade } from 'src/app/store/guideline-store/guideline.facade';
import { CommentsComponent } from 'src/app/components/table-contents/comments/comments.component';
import { CommentGroupComponent } from 'src/app/components/table-contents/comments/comment-group/comment-group.component';
import { RandomColorDirective } from 'src/app/components/table-contents/comments/directives/random-color.directive';
import { ActiveFilterDirective } from 'src/app/components/table-contents/comments/directives/active-filter.directive';
import { CommentListItemComponent } from 'src/app/components/table-contents/comments/comment-list-item/comment-list-item.component';
import { ExpandedCommentComponent } from '../components/table-contents/comments/expanded-comment/expanded-comment.component';


// TODO: Bring Table of Contents into its own feature module
const components = [
  ToolbarComponent,
  SidebarComponent,
  FooterComponent,
  GraphComponent,
  UpdateStatusComponent,
  TextEditorComponent,
  ConfirmationDialogComponent,
  TableContentsComponent,
  TableContentsListComponent,
  ListItemComponent,
  CreateStartingPointsComponent,
  CreateStartingPointsDialogComponent,
  StartingPointComponent,
  StartingPointsComponent,
  AlertComponent,
  SendToReviewDialogComponent,
  ResponsiveNavbarComponent,
  ExitAppComponent,
  CommentsComponent,
  CommentGroupComponent,
  CommentListItemComponent,
  ExpandedCommentComponent
];

const pipes = [
  IsGuidelineStatusPipe
];

const facades = [
  NavigationFacade,
  UserProfileFacade,
  NodeCommentFacade,
  GuidelineFacade
];

const directives = [
  RandomColorDirective,
  ActiveFilterDirective
];

@NgModule({
  declarations: [
    ...components,
    ...pipes,
    ...directives
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule
  ],
  providers: [
    ...facades,
    AlertService,
    UpdateStatusDialogService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ...components,
    ...pipes,
    ...directives
  ]
})
export class SharedModule { }
