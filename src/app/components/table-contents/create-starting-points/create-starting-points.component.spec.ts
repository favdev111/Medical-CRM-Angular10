import { async, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectTableItems } from 'src/app/store/table-item-store/table-item.selectors';
import { createStartingPoint } from 'src/app/test-utils/dto-factory';

import { CreateStartingPointsComponent } from './create-starting-points.component';

describe('CreateStartingPointsComponent', () => {
  let spectator: Spectator<CreateStartingPointsComponent>;
  let mockStore: MockStore;
  const initialState = { entities: {} };
  const createComponent = createComponentFactory({ 
    component: CreateStartingPointsComponent,
    imports: [ MatDialogModule, RouterTestingModule ],
    providers: [
      provideMockStore({
        initialState,
        selectors: [
          { selector: selectTableItems, value: [createStartingPoint()]}
        ]
      })
    ]
  });

  beforeEach(async(() => {
    spectator = createComponent({
      props: {
        nodeId: 1
      }
    });
    mockStore = TestBed.inject(MockStore);
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
