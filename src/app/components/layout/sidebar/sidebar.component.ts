import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { NodeMap } from 'src/app/models/dto/node';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/table-item-store/table-item.reducer';
import { selectAllStartingPointNodeIds } from 'src/app/store/table-item-store/table-item.selectors';
import { NodeCommentFacade } from 'src/app/store/node-comment-store/node-comment.facade';
import { NavigationFacade } from 'src/app/store/navigation-store/navigation.facade';
import { selectLatestReviewId } from 'src/app/store/guideline-store/guideline.selectors';
import { take } from 'rxjs/operators';
import { NodeComment } from 'src/app/models/dto/node-comment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges {

  public startingPointNodeIds$: Observable<any>;
  public shouldShowComments: boolean;

  @Input() isPreviewMode: boolean;
  @Input() guidelineId: number;
  @Input() guidelineVersionId: number;
  @Input() guidelineTypeId: number;
  @Input() nodeMap: NodeMap;
  @Input() isReviewMode: boolean;

  @ViewChild('drawer') drawer: MatSidenav;

  constructor(public nodeCommentFacade: NodeCommentFacade, public navigationFacade: NavigationFacade, private _store: Store<State>) { }

  ngOnInit(): void {
    this.startingPointNodeIds$ = this._store.select(selectAllStartingPointNodeIds);
    this._store.select(selectLatestReviewId)
      .pipe(take(1))
      .subscribe(latestReviewId => {
        this.shouldShowComments = Boolean(latestReviewId);
        if (this.shouldShowComments) {
          this.nodeCommentFacade.load(latestReviewId);
        } else {
          this.nodeCommentFacade.resetNodeComments();
        }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isOpen && changes.isOpen.previousValue !== undefined && changes.isOpen.currentValue !== changes.isOpen.previousValue) {
      this.closeHandler();
    }
  }

  public closeHandler(): void {
    this.navigationFacade.toggleSidenav();
  }

  public setExpandedComments(commentIds: number[]): void {
    this.nodeCommentFacade.setExpandedComments(commentIds);
  }
}
