import { Component, Input, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CdkDrag, CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';

import { TableItem } from 'src/app/models/dto/table-item';
import { State } from 'src/app/store/table-item-store/table-item.reducer';
import { update, remove, reorder } from 'src/app/store/table-item-store/table-item.actions';
import { Subscription, merge } from 'rxjs';
import { startWith, map, switchMap, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent, DialogData } from '../../confirmation-dialog/confirmation-dialog.component';
import { confirmationDialogConfig, DELETE_STARTING_POINT_CONFIRMATION } from 'src/app/constants';
import { AlertType } from 'src/app/models/enums/alert-type';
import { MatDialog } from '@angular/material/dialog';

const SCROLL_SPEED = 10;

@Component({
  selector: 'app-table-contents-list',
  templateUrl: './table-contents-list.component.html',
  styleUrls: ['../table-contents.component.scss']
})
export class TableContentsListComponent implements AfterViewInit, OnDestroy {
  @Input() sectionTitle: string;
  @Input() isEditMode: boolean;
  @Input() data: TableItem[];

  @ViewChild('scrollElement') scrollElement: ElementRef<HTMLElement>;
  @ViewChildren(CdkDrag) dragElements: QueryList<CdkDrag>;

  scrollSubscriptions$ = new Subscription();

  private animationFrame: number | undefined;

  // This is because global table item has pageNumber 1
  // and indexes start at 0 i.e first starting point is page 2 and therefore offest between 0 and 2 is 2
  private offset = 2;

  constructor(private store: Store<State>, public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.configureScrollSubscriptions();
  }

  ngOnDestroy(): void {
    this.scrollSubscriptions$.unsubscribe();
  }

  configureScrollSubscriptions(): void {
    const onMove$ = this.dragElements.changes.pipe(
      startWith(this.dragElements),
      map((d: QueryList<CdkDrag>) => d.toArray()),
      map(dragEls => dragEls.map(drag => drag.moved)),
      switchMap(obs => merge(...obs)),
      tap(this.triggerScroll)
    );

    const onDown$ = this.dragElements.changes.pipe(
      startWith(this.dragElements),
      map((d: QueryList<CdkDrag>) => d.toArray()),
      map(dragEls => dragEls.map(drag => drag.ended)),
      switchMap(obs => merge(...obs)),
      tap(this.cancelScroll)
    );

    this.scrollSubscriptions$.add(onMove$.subscribe());
    this.scrollSubscriptions$.add(onDown$.subscribe());
  }

  updateTableItem(tableItem: TableItem): void {
    this.store.dispatch(update({ id: tableItem.id, changes: tableItem }));
  }

  openDeleteConfirmation(id: number): void {
    const data: DialogData = {
      title: 'Delete Confirmation',
      content: DELETE_STARTING_POINT_CONFIRMATION,
      type: AlertType.Warning,
      acceptText: 'Confirm',
      'declineText': 'Cancel'
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, 
      { 
        ...confirmationDialogConfig,
        data, 
        panelClass: 'confirmation-dialog'
      }
    );

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteTableItem(id);
      }
    })
  }

  deleteTableItem(id: number): void {
    this.store.dispatch(remove({ id }));
  }

  drop(event: CdkDragDrop<TableItem[]>) {
    if (event.previousIndex !== event.currentIndex) {
      this.reorderStartingPoints(event.previousIndex, event.currentIndex, event.item.data);
    }
  }

  reorderStartingPoints(previousIndex: number, currentIndex: number, item: TableItem): void {
    moveItemInArray(this.data, previousIndex, currentIndex);

    const tableItem = { ...item, pageNumber: currentIndex + this.offset };
    this.store.dispatch(reorder({ tableItem }));
  }

  triggerScroll($event: CdkDragMove) {
    if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = undefined;
    }
    this.animationFrame = requestAnimationFrame(() => this.scroll($event));
  }

  private cancelScroll() {
    if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = undefined;
    }
  }

  private scroll($event: CdkDragMove) {
    const { y } = $event.pointerPosition;
    const baseEl = this.scrollElement.nativeElement;
    const box = baseEl.getBoundingClientRect();
    const scrollTop = baseEl.scrollTop;
    const top = box.top + - y ;
    if (top > 0 && scrollTop !== 0) {
      const newScroll = scrollTop - SCROLL_SPEED * Math.exp(top / 50);
      baseEl.scrollTop = newScroll;
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
      return;
    }

    const bottom = y - box.bottom ;
    if (bottom > 0 && scrollTop < box.bottom) {
      const newScroll = scrollTop + SCROLL_SPEED * Math.exp(bottom / 50);
      baseEl.scrollTop = newScroll;
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
    }
  }

}
