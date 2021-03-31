import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedCommentComponent } from './expanded-comment.component';

describe('ExpandedCommentComponent', () => {
  let component: ExpandedCommentComponent;
  let fixture: ComponentFixture<ExpandedCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandedCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandedCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
