import { async, TestBed } from '@angular/core/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { GuidelineListComponent } from './guideline-list.component';
import { selectGuidelineIsLoading, selectGuidelineListData } from 'src/app/store/guideline-store/guideline.selectors';
import { createGuidelineListData } from 'src/app/test-utils/dto-factory';
import { loadAll } from 'src/app/store/guideline-store/guideline.actions';

describe('GuidelineListComponent', () => {
  let spectator: Spectator<GuidelineListComponent>;
  let mockStore: MockStore;
  const initialState = {
    guidelineListData: [],
    isLoading: false
  };
  const createComponent = createComponentFactory({ 
    component: GuidelineListComponent,
    imports: [MatDialogModule, RouterTestingModule, MatSortModule, MatTableModule],
    providers: [
      provideMockStore({
        initialState,
        selectors: [
          { selector: selectGuidelineIsLoading, value: false },
          { selector: selectGuidelineListData, value: createGuidelineListData() }
        ]
      })
    ]
  });

  beforeEach(async(() => {
    spectator = createComponent();
    mockStore = TestBed.inject(MockStore);
    spyOn(mockStore, 'dispatch').and.callThrough();
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have dispatched to load', () => {
    spectator.component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadAll());
  });
});
