import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NodeCommentStatus } from 'src/app/models/enums/node-comment-status';

@Directive({
  selector: '[activeFilter]'
})
export class ActiveFilterDirective implements OnInit, OnChanges {

  private readonly LIGHT_BLUE_HIGHLIGHT = 'rgba(0, 102, 204, 0.08)';
  private readonly WHITE = '#fff' ;

  @Input() currentFilter: NodeCommentStatus;
  @Input() filter: NodeCommentStatus;

  constructor(private _el: ElementRef) { }

  ngOnInit(): void {
    this.setBackground();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentFilter && changes.currentFilter.previousValue !== changes.currentFilter.currentValue) {
      this.setBackground();
    }
  }

  private setBackground(): void {
    if (this.currentFilter === this.filter) {
      this._el.nativeElement.style.backgroundColor = this.LIGHT_BLUE_HIGHLIGHT;
    } else {
      this._el.nativeElement.style.backgroundColor = this.WHITE;
    }
  }
}