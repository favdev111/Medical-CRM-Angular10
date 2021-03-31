import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSortModule } from '@angular/material/sort';

import { GuidelineVersionListComponent } from './guideline-version-list.component';

describe('GuidelineVersionListComponent', () => {
  let component: GuidelineVersionListComponent;
  let fixture: ComponentFixture<GuidelineVersionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidelineVersionListComponent ],
      imports: [ MatSortModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidelineVersionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
