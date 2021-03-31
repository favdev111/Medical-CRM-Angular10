import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NodeComment } from 'src/app/models/dto/node-comment';
import { NodeCommentStatus } from 'src/app/models/enums/node-comment-status';

@Component({
  selector: 'app-expanded-comment',
  templateUrl: './expanded-comment.component.html',
  styleUrls: ['../comments.component.scss']
})
export class ExpandedCommentComponent implements OnInit {

  public acceptedFilter = NodeCommentStatus.ACCEPTED;
  public deniedFilter = NodeCommentStatus.DENIED;

  @Input() comment: NodeComment;
  @Output() onUpdateNodeCommentStatus: EventEmitter<NodeComment> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public updateNodeCommentStatus(status: NodeCommentStatus): void {
    this.onUpdateNodeCommentStatus.emit({ ...this.comment, status });
  }

}
