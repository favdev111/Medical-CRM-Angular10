import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NodeComment } from 'src/app/models/dto/node-comment';
import { NodeCommentStatus } from 'src/app/models/enums/node-comment-status';

@Component({
  selector: 'app-comment-list-item',
  templateUrl: './comment-list-item.component.html',
  styleUrls: ['../comments.component.scss']
})
export class CommentListItemComponent implements OnInit {

  public commentStatusImgSrc: string = null;

  @Input() comment: NodeComment;
  
  @Output() onSetExpandedComment: EventEmitter<NodeComment> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    if (this.comment.status) {
      if (this.comment.status === NodeCommentStatus.ACCEPTED) {
        this.commentStatusImgSrc = './assets/system-icon-outlined-icons-general-icon-checkmark.svg';
      } else {
        this.commentStatusImgSrc = './assets/system-icon-outlined-icons-general-icon-close.svg';
      }
    }
  }

  public setExpandedComment(): void {
    this.onSetExpandedComment.emit(this.comment);
  }
}
