import { async, TestBed } from '@angular/core/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createStartingPoint } from 'src/app/test-utils/dto-factory';

import { ListItemComponent } from './list-item.component';

describe('ListItemComponent', () => {
  let spectator: Spectator<ListItemComponent>;
  const createComponent = createComponentFactory(ListItemComponent);

  beforeEach(async(() => {
    spectator = createComponent({
      props: {
        item: createStartingPoint([1]),
        isEditMode: false
      }
    });
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
