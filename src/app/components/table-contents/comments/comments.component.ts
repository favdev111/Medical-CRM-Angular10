import { Component, OnInit } from '@angular/core';

import { NodeComment } from 'src/app/models/dto/node-comment';
import { NodeCommentStatus } from 'src/app/models/enums/node-comment-status';
import { NodeCommentFacade } from 'src/app/store/node-comment-store/node-comment.facade';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['../table-contents.component.scss', './comments.component.scss']
})
export class CommentsComponent implements OnInit {

  public commentsGroupedByUser = {};
  public nodeComments: NodeComment[] = [];
  public currentComments: number;
  public totalComments: number;
  public acceptedFilter = NodeCommentStatus.ACCEPTED;
  public deniedFilter = NodeCommentStatus.DENIED;
  public activeFilter: NodeCommentStatus = null;
  public expandedNodeComments: NodeComment[] = [];


  constructor(public nodeCommentFacade: NodeCommentFacade) { }

  ngOnInit(): void {
    this.configureData();
  }

  public trackByFn(index: number, item: any): string {
    return item.key;
  }

  public setFilterType(filterType: NodeCommentStatus = null): void {
    this.activeFilter = filterType;
    this.commentsGroupedByUser = this.groupByDisplayName(this.nodeComments);
  }

  public setExpandedComments(comment: NodeComment = null): void {
    if (comment) {
      this.nodeCommentFacade.setExpandedComments([comment.nodeCommentId]);
    } else {
      this.nodeCommentFacade.setExpandedComments();
    }
  }

  public updateNodeCommentStatus(comment: NodeComment): void {
    this.nodeCommentFacade.updateStatus(comment);
    this.setExpandedComments();
  }

  private configureData(): void {
    this.nodeCommentFacade.nodeComments$.subscribe((nodeComments: NodeComment[]) => {
      if (nodeComments)  {
        this.nodeComments = nodeComments;
        this.totalComments = nodeComments.length;
        this.commentsGroupedByUser = this.groupByDisplayName(nodeComments);
      }
    });
    this.nodeCommentFacade.expandedNodeComments$.subscribe((expandedNodeComments) => this.expandedNodeComments = expandedNodeComments);
  }

  private groupByDisplayName(nodeComments: NodeComment[]): any {
    this.currentComments = 0;
    return nodeComments.reduce((previous, current) => {
      if (this.activeFilter) {
        if (current.status === this.activeFilter) {
          this.currentComments += 1;
          (previous[current['userDisplayName']] = previous[current['userDisplayName']] || []).push(current);
        }
      } else {
        (previous[current['userDisplayName']] = previous[current['userDisplayName']] || []).push(current);
      }
      return previous;
    }, {})
  }
}
