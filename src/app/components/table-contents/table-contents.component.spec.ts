import { async, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponents } from 'ng-mocks'; 

import { initialState } from 'src/app/store/table-item-store/table-item.reducer';
import { selectTableItems } from 'src/app/store/table-item-store/table-item.selectors';
import { createStartingPoint } from 'src/app/test-utils/dto-factory';
import { TableContentsListComponent } from './table-contents-list/table-contents-list.component';
import { TableContentsComponent } from './table-contents.component';

describe('TableContentsComponent', () => {
  let spectator: Spectator<TableContentsComponent>;
  let mockStore: MockStore;
  const createComponent = createComponentFactory({
    component: TableContentsComponent,
    imports: [ MatMenuModule ],
    declarations: [
      MockComponents(
        TableContentsListComponent
      )
    ],
    providers: [
      provideMockStore({
        initialState,
        selectors: [
          { selector: selectTableItems, value: [createStartingPoint()]}
        ]
      })
    ]
  })

  beforeEach(async(() => {
    spectator = createComponent({
      props: {
        isPreviewMode: false
      }
    });
    mockStore = TestBed.inject(MockStore);
  }));

  afterEach(() => {
    selectTableItems.release();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('selected observable should have value', () => {
    spectator
      .component
      .startingPoints$
      .subscribe((result) => expect(result.length).toBe(1));
  });

  it('should have title', () => {
    const el = spectator.fixture.nativeElement.querySelector('#table-contents-title');
    expect(el.textContent).toContain('Table');
  });
});
