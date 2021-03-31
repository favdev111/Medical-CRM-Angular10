import { async, TestBed } from '@angular/core/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectNodesByIds } from 'src/app/store/node-store/node.selectors';
import { initialState } from 'src/app/store/node-store/node.reducer';
import { createNodeA, createStartingPoint } from 'src/app/test-utils/dto-factory';

import { StartingPointsComponent } from './starting-points.component';
import { MatMenuModule } from '@angular/material/menu';

describe('StartingPointsComponent', () => {
  let spectator: Spectator<StartingPointsComponent>;
  let mockStore: MockStore;
  const createComponent = createComponentFactory({ 
    component: StartingPointsComponent,
    imports: [ MatMenuModule ],
    providers: [
      provideMockStore({
        initialState,
        selectors: [
          { selector: selectNodesByIds, value: [createNodeA()] }
        ]
      })
    ]
  });

  beforeEach(async(() => {
    spectator = createComponent({
      props: {
        item: createStartingPoint([1])
      }
    });
    mockStore = TestBed.inject(MockStore);
  }));

  afterEach(() => {
    selectNodesByIds.release();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should create and select from store', () => {
    expect(spectator.component.nodes.length).toEqual(1);
  });
});
