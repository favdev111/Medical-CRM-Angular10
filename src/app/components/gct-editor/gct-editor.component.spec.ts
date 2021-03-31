import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GCTEditorComponent } from './gct-editor.component';

describe('GCTEditorComponent', () => {
  let component: GCTEditorComponent;
  let fixture: ComponentFixture<GCTEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GCTEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GCTEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
