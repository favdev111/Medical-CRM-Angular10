import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitAppComponent } from './exit-app.component';

describe('ExitAppComponent', () => {
  let component: ExitAppComponent;
  let fixture: ComponentFixture<ExitAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
