import { async, TestBed } from '@angular/core/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { selectAllStartingPointNodeIds } from 'src/app/store/table-item-store/table-item.selectors';
import { createNodeMap1 } from 'src/app/test-utils/d3-factory';
import { createNodeA } from 'src/app/test-utils/dto-factory';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let spectator: Spectator<SidebarComponent>;
  let mockStore: MockStore;
  const initialState = { entities: {} };
  const createComponent = createComponentFactory({ 
    component: SidebarComponent,
    providers: [
      provideMockStore({
        initialState,
        selectors: [
          { selector: selectAllStartingPointNodeIds, value: [1] }
        ]
      })
    ]
  });

  beforeEach(async(() => {
    spectator = createComponent({
      props: {
        isOpen: true,
        isPreviewMode: false,
        guidelineId: 1,
        nodeMap: createNodeMap1([createNodeA(false)])
      },
    });
    mockStore = TestBed.inject(MockStore);
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have starting point node id selected', () => {
    spectator
      .component
      .startingPointNodeIds$
      .subscribe((result: number[]) => expect(result.length).toEqual(1));
  });
});
