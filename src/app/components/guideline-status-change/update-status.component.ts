import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil } from "rxjs/operators";

import { GuidelineActionTypes } from "src/app/store/guideline-store/guideline.types";
import { State } from 'src/app/store/guideline-store/guideline.reducer';
import { GuidelineStatus } from "src/app/models/enums/guideline-status";
import { Observable, Subject } from "rxjs";
import { selectCurrentGuidelineStatus } from "src/app/store/guideline-store/guideline.selectors";
import { UpdateStatusDialogService } from "./services/update-status-dialog.service";
import { resetNavigationToDefaults } from "src/app/store/navigation-store/navigation.actions";
import { GuidelineStatusChangeSucceeded } from "src/app/models/dto/guideline-status-change";

// Send to review dialog component
@Component({
  selector: 'app-update-status-component',
  templateUrl: 'update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {

  @Input() guidelineVersionId: number;
  @Input() guidelineTypeId: number;
  @Input() isPreviewMode: boolean;
  @Input() isReviewMode: boolean;
  currentGuidelineStatus$: Observable<GuidelineStatus>;

  destroyed$ = new Subject<boolean>();

  constructor(public updateStatusDialogService: UpdateStatusDialogService, private store: Store<State>, updates$: Actions) {
    updates$.pipe(
      ofType(
        GuidelineActionTypes.UPDATE_GUIDELINE_STATUS_SUCCESS
      ),
      takeUntil(this.destroyed$),
    )
    .subscribe((payload: GuidelineStatusChangeSucceeded) => {
      if (payload.changeDto.status === GuidelineStatus.PUBLISHED) {
        this.updateStatusDialogService.openPublishProgressDialog();
      } else if (payload.changeDto.status === GuidelineStatus.REVIEW) {
        this.updateStatusDialogService.sentToReviewDialog();
      } else {
        this.store.dispatch(resetNavigationToDefaults());
      }
    })
  }

  ngOnInit(): void {
    this.currentGuidelineStatus$ = this.store.select(selectCurrentGuidelineStatus);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}