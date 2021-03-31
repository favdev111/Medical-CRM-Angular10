import { async, TestBed } from '@angular/core/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { createStartingPoint } from 'src/app/test-utils/dto-factory';
import { TableContentsListComponent } from './table-contents-list.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('TableContentsListComponent', () => {
  const initialState = {};
  const sectionTitle = 'Table of Contents';
  const isEditMode = true;
  let spectator: Spectator<TableContentsListComponent>;
  let mockStore: MockStore;
  const createComponent = createComponentFactory({ 
    component: TableContentsListComponent,
    imports: [ MatDialogModule ],
    providers: [
      provideMockStore({
        initialState,
      }),
    ]
  });

  beforeEach(async(() => {
    spectator = createComponent({
      props: {
        data: [createStartingPoint([1])],
        sectionTitle,
        isEditMode
      }
    });
    mockStore = TestBed.inject(MockStore);
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
