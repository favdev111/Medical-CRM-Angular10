import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveNavbarComponent } from './responsive-navbar.component';

describe('ResponsiveNavbarComponent', () => {
  let component: ResponsiveNavbarComponent;
  let fixture: ComponentFixture<ResponsiveNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
