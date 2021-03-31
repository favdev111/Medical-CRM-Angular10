import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TableItem } from 'src/app/models/dto/table-item';
import { NavigationFacade } from 'src/app/store/navigation-store/navigation.facade';
import { State } from 'src/app/store/table-item-store/table-item.reducer';
import { selectTableItems } from 'src/app/store/table-item-store/table-item.selectors';

@Component({
  selector: 'app-table-contents',
  templateUrl: './table-contents.component.html',
  styleUrls: ['./table-contents.component.scss']
})
export class TableContentsComponent implements OnInit {

  public startingPoints$: Observable<TableItem[]>;
  public isEditMode = false;

  @Input() isPreviewMode: boolean;

  constructor(private store: Store<State>, private _navigationFacade: NavigationFacade) {
    this.startingPoints$ = this.store.select(selectTableItems);
  }

  ngOnInit(): void { }

  public toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  public close(): void {
    this._navigationFacade.toggleSidenav();
  }
}
