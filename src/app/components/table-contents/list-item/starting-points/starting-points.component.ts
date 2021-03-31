import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TableItem } from 'src/app/models/dto/table-item';
import { Node } from 'src/app/models/dto/node';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State } from 'src/app/store/node-store/node.reducer';
import { selectNodesByIds } from 'src/app/store/node-store/node.selectors';

@Component({
  selector: 'app-starting-points',
  templateUrl: './starting-points.component.html',
  styleUrls: ['./starting-points.component.scss']
})

export class StartingPointsComponent implements OnInit, OnDestroy {
  @Input() item: TableItem;
  nodes$: Subscription;
  nodes:Partial<Node>[]
  isShowMore = false;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    if (this.item.nodeIds && this.item.nodeIds.length) {
      this.nodes$ = this.store.select(selectNodesByIds, {ids: this.item.nodeIds}).subscribe(nodes => this.nodes = nodes);
    }
  }

  ngOnDestroy(): void {
    if (this.nodes$) {
      this.nodes$.unsubscribe();
    }
  }

  showMore(): void {
    this.isShowMore = !this.isShowMore;
  }
}
