import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NodeComment } from 'src/app/models/dto/node-comment';

@Component({
  selector: 'app-comment-group',
  templateUrl: './comment-group.component.html',
  styleUrls: ['../comments.component.scss']
})
export class CommentGroupComponent implements OnInit {

  public panelOpenState = false;

  @Input() userDisplayName: string;
  @Input() reviewUserId: number;
  @Input() comments: NodeComment[];

  @Output() onSetExpandedComment: EventEmitter<NodeComment> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  public setExpandedComment(comment: NodeComment): void {
    this.onSetExpandedComment.emit(comment);
  }

}
