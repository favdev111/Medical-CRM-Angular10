import { async, TestBed } from '@angular/core/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectAppVersion } from 'src/app/store/guideline-store/guideline.selectors';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  const initialState = { appVersion: null };
  let spectator: Spectator<FooterComponent>;
  let mockStore: MockStore;
  const createComponent = createComponentFactory({ 
    component: FooterComponent,
    providers: [
      provideMockStore({
        initialState,
        selectors: [
          { selector: selectAppVersion, value: 'version' }
        ]
      })
    ]
  });

  beforeEach(async(() => {
    spectator = createComponent();
    mockStore = TestBed.inject(MockStore);
  }));

  afterEach(() => {
    selectAppVersion.release();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have correct value as text', () => {
    const el = spectator.fixture.nativeElement.querySelector('h3');
    expect(el.textContent).toEqual('version');
  });
});
