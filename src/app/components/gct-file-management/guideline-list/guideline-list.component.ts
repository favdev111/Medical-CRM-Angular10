import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { detailExpand, detailExpandArrow } from 'src/app/shared/animations/animations';
import { State } from 'src/app/store/guideline-store/guideline.reducer';
import { loadAll, deleteGuidelineVersion } from 'src/app/store/guideline-store/guideline.actions';
import { selectGuidelineIsLoading, selectGuidelineListData } from 'src/app/store/guideline-store/guideline.selectors';
import { Observable, Subject, Subscription } from 'rxjs';
import { GuidelineListData } from 'src/app/models/business/guideline-list-data';
import { CreateGuidelineDialogComponent } from '../../gct-file-management/create-guideline/create-guideline.component';
import { MatDialog } from '@angular/material/dialog';
import { GuidelineType } from 'src/app/models/dto/guideline-type';
import { Router } from '@angular/router';
import { DELETE_GUIDELINE_CONFIRMATION, confirmationDialogConfig } from 'src/app/constants';
import { ConfirmationDialogComponent, DialogData } from '../../confirmation-dialog/confirmation-dialog.component';
import { AlertType } from 'src/app/models/enums/alert-type';
import { UpdateStatusDialogService } from '../../guideline-status-change/services/update-status-dialog.service';
import { Actions, ofType } from '@ngrx/effects';
import { GuidelineActionTypes } from 'src/app/store/guideline-store/guideline.types';
import { takeUntil } from 'rxjs/operators';
import { GuidelineStatus } from 'src/app/models/enums/guideline-status';
import { GuidelineStatusChangeSucceeded } from 'src/app/models/dto/guideline-status-change';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-guideline-list',
  templateUrl: './guideline-list.component.html',
  styleUrls: ['./guideline-list.component.scss'],
  animations: [detailExpand, detailExpandArrow],
})
export class GuidelineListComponent implements OnInit, OnDestroy {
  public dataSource: MatTableDataSource<GuidelineListData> = new MatTableDataSource([]);
  public guidelinesData$: Subscription;
  public isLoading$: Observable<boolean>;
  public columnsToDisplay = ['arrow', 'cancerType', 'version', 'modified', 'creator', /*'lastModifiedBy',*/ 'created','status', 'actions'];
  public expandedElement: GuidelineListData | null;

  private destroyed$ = new Subject<boolean>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public updateStatusDialogService: UpdateStatusDialogService,
    private store: Store<State>,
    private _router: Router,
    private _updates$: Actions) {
    this.configureSubscriptions();
  }

  ngOnInit(): void {
    this.store.dispatch(loadAll());
    this.configureTable();
  }

  ngOnDestroy(): void {
    this.guidelinesData$.unsubscribe();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public handleExpand(element: GuidelineListData): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  public openCreateDialog(guidelineType: GuidelineType): void {
    this.dialog.open(CreateGuidelineDialogComponent, { width: '854px', height: '495px', data: guidelineType });
  }

  public openDeleteDialog(guidelineVersionId: number): void {
    const data: DialogData = {
      title: 'Delete Confirmation',
      content: DELETE_GUIDELINE_CONFIRMATION,
      type: AlertType.Warning,
      acceptText: 'Confirm',
      declineText: 'Cancel'
    };

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        ...confirmationDialogConfig,
        data,
        panelClass: 'confirmation-dialog'
      }
    );

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.delete(guidelineVersionId);
      }
    });
  }

  public navigateToEditor(id: number, guidelineType: string, version: string): void {
    const typeAndVersion = `${guidelineType}_${version}`;
    this._router.navigate([`/editor/${typeAndVersion}/${id}`] );
  }

  private configureTable(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (element: GuidelineListData, property) => {
      switch (property) {
        case 'cancerType': return element.guidelineType.name;
        default: return element[property];
      }
    };
  }

  private configureSubscriptions(): void {
    this.guidelinesData$ = this.store.select(selectGuidelineListData).subscribe((data) => this.dataSource.data = data);
    this.isLoading$ = this.store.select(selectGuidelineIsLoading);
    this._updates$.pipe(
      ofType(
        GuidelineActionTypes.UPDATE_GUIDELINE_STATUS_SUCCESS
      ),
      takeUntil(this.destroyed$),
    )
    .subscribe((payload: GuidelineStatusChangeSucceeded) => {
      if (payload.changeDto.status === GuidelineStatus.PUBLISHED) {
        this.updateStatusDialogService.openPublishProgressDialog();
      }
    });
  }

  private delete(guidelineVersionId: number): void {
    this.store.dispatch(deleteGuidelineVersion({ guidelineVersionId }));
  }
}
