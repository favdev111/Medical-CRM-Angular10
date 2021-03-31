import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { createGuidelineType } from 'src/app/test-utils/dto-factory';

import { CreateGuidelineComponent, CreateGuidelineDialogComponent } from './create-guideline.component';

describe('CreateGuidelineComponent', () => {
  let component: CreateGuidelineComponent;
  let fixture: ComponentFixture<CreateGuidelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGuidelineComponent ],
      imports: [ MatDialogModule, RouterTestingModule ],
      providers: [ { provide: MAT_DIALOG_DATA, useValue: createGuidelineType()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGuidelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
