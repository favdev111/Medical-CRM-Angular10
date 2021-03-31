import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

import { TableItem } from 'src/app/models/dto/table-item';
import { State } from 'src/app/store/table-item-store/table-item.reducer';
import { addNode, create } from 'src/app/store/table-item-store/table-item.actions';
import { selectTableItems } from 'src/app/store/table-item-store/table-item.selectors';
import { CreateStartingPointsDialogComponent } from './create-starting-points-dialog/create-starting-points-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { MAX_STARTING_POINT_NAME_LENGTH } from 'src/app/constants';

@Component({
  selector: 'app-create-starting-points',
  templateUrl: './create-starting-points.component.html',
  styleUrls: ['./create-starting-points.component.scss']
})
export class CreateStartingPointsComponent implements OnInit, OnDestroy {

  @Input() nodeId: number;
  startingPoints: TableItem[];
  currentStartingPoint: TableItem;
  startingPoints$: Subscription;
  guidelineId: number;

  constructor(
    private store: Store<State>,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.guidelineId = parseInt(params.id, 10);
    }).unsubscribe();
    this.configureStartingPoints();
  }

  ngOnDestroy(): void {
    this.startingPoints$.unsubscribe();
  }

  configureStartingPoints(): void {
    this.startingPoints$ = this.store.select(selectTableItems).subscribe(startingPoints => {
      this.startingPoints = startingPoints;
      this.setDefaultStartingPoint();
    });
  }

  setDefaultStartingPoint(): void {
    this.startingPoints.forEach(startingPoint => {
      if (startingPoint.nodeIds !== null && startingPoint.nodeIds.includes(this.nodeId)) {
        this.currentStartingPoint = startingPoint;
        return;
      }
    });
  }

  handleSelection(change: MatSelectChange): void {
    if (change.value === 'CREATE_NEW') {
      this.openStartingPointDialog();
    } else {
      this.addNodeToStartingPoint(change.value);
    }
  }

  openStartingPointDialog(): void {
    const dialogRef = this.dialog.open(CreateStartingPointsDialogComponent,
      { width: '35rem', height: '10rem', panelClass: 'create-starting-points__dialog-panel', data: { guidelineId: this.guidelineId, nodeId: this.nodeId } },
    );

    dialogRef.afterClosed().subscribe((startingPoint: TableItem) => {
      const isValid = this.validateStartingPoint(startingPoint.name);
      if (startingPoint) {
        this.createStartingPoint(startingPoint);
        // Error handling handle in interceptor, but still need to reset current starting point
        if (!isValid) {
          this.currentStartingPoint = null;
        }
      } else {
        this.currentStartingPoint = null;
      }
    });
  }

  validateStartingPoint(name: string): boolean {
    return name && name.length < MAX_STARTING_POINT_NAME_LENGTH;
  }

  addNodeToStartingPoint(tableItem: TableItem): void {
    this.store.dispatch(addNode({ tableItemId: tableItem.id, nodeId: this.nodeId }));
  }

  createStartingPoint(tableItem: TableItem): void {
    this.store.dispatch(create({ tableItem }));
  }

}
