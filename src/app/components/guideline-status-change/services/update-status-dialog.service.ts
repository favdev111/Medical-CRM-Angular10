import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { MatDialog } from '@angular/material/dialog';

import {
  CANCEL,
  CONFIRM,
  confirmationDialogConfig,
  DRAFT_GUIDELINE_DISCLAIMER,
  PUBLISH_GUIDELINE_DISCLAIMER,
  PUBLISH_GUIDELINE_PROGRESS,
  sendToReviewDialogConfig,
  SENT_TO_REVIEW_CONFIRMATION
} from 'src/app/constants';
import { AlertType } from 'src/app/models/enums/alert-type';
import { GuidelineStatus } from 'src/app/models/enums/guideline-status';
import { updateGuidelineStatus } from 'src/app/store/guideline-store/guideline.actions';
import { GuidelineStatusChangePayload } from 'src/app/store/guideline-store/guideline.types';
import { ConfirmationDialogComponent, DialogData } from '../../confirmation-dialog/confirmation-dialog.component';
import { SendToReviewDialogComponent } from '../send-to-review-dialog/send-to-review-dialog.component';
import { State } from 'src/app/store/guideline-store/guideline.reducer';

@Injectable()
export class UpdateStatusDialogService {

  constructor(public dialog: MatDialog, private store: Store<State>) { }

  public openStatusChangeDialog(val: string, guidelineVersionId: number, guidelineTypeId: number): void {
    const status = this.convertStatusToEnum(val);

    // Probably will never be null, might want to handle it though
    if (status) {
      const { component, config } = this.configureDialog(status, guidelineVersionId)
      const dialogRef = this.dialog.open(component, config);

      dialogRef.afterClosed().subscribe((val: GuidelineStatusChangePayload | boolean) => {
        if (val) {
          if (typeof val === 'boolean') {
            this.store.dispatch(updateGuidelineStatus({ guidelineVersionId, guidelineTypeId, changeDto: { status } }));
          } else {
            this.store.dispatch(updateGuidelineStatus(val as GuidelineStatusChangePayload));
          }
        }
      })
    }
  }

  private convertStatusToEnum(status: string): GuidelineStatus {
    switch (status) {
      case GuidelineStatus.DRAFT.toString():
        return GuidelineStatus.DRAFT;
      case GuidelineStatus.REVIEW.toString():
        return GuidelineStatus.REVIEW;
      case GuidelineStatus.PUBLISHED.toString():
        return GuidelineStatus.PUBLISHED
      default:
        console.error(`Incorrect status provided: ${status}`);
        return null;
    }
  }

  private configureDialog(status: GuidelineStatus, guidelineVersionId: number): any {
    if (status === GuidelineStatus.REVIEW) {
      return {
        component: SendToReviewDialogComponent, config: {
          ...sendToReviewDialogConfig,
          panelClass: 'send-review-dialog',
          data: { guidelineVersionId }
        }
      };
    } else if (status === GuidelineStatus.PUBLISHED) {
      return {
        component: ConfirmationDialogComponent,
        config: {
          ...confirmationDialogConfig,
          data: {
            title: 'Disclaimer',
            content: PUBLISH_GUIDELINE_DISCLAIMER,
            type: AlertType.Warning,
            acceptText: CONFIRM,
            declineText: CANCEL
          },
          panelClass: 'confirmation-dialog'
        }
      }
    } else {
      return {
        component: ConfirmationDialogComponent,
        config: {
          ...confirmationDialogConfig,
          data: {
            title: 'Disclaimer',
            content: DRAFT_GUIDELINE_DISCLAIMER,
            type: AlertType.Warning,
            acceptText: CONFIRM,
            declineText: CANCEL
          },
          panelClass: 'confirmation-dialog'
        }
      }
    }
  }

  public openPublishProgressDialog(): void {
    const data: DialogData = {
      title: 'Publish in progress',
      content: PUBLISH_GUIDELINE_PROGRESS,
      type: AlertType.Progress,
      declineText: CANCEL
    };

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        ...confirmationDialogConfig,
        data,
        panelClass: 'confirmation-dialog'
      }
    );
    setTimeout(() => {
      dialogRef.close();
    }, 3000);
  }

  public sentToReviewDialog(): void {
    const data: DialogData = {
      title: 'Approval request sent',
      content: SENT_TO_REVIEW_CONFIRMATION,
      type: AlertType.Info,
      acceptText: 'ok',
    };

    this.dialog.open(
      ConfirmationDialogComponent,
      {
        ...confirmationDialogConfig,
        data,
        panelClass: 'confirmation-dialog'
      }
    );
  }
}