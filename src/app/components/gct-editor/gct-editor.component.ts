import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NodeMap } from 'src/app/models/dto/node';
import { selectNodeMap } from 'src/app/store/node-store/node.selectors';
import { State } from 'src/app/store/node-store/node.reducer';
import { NavigationFacade } from 'src/app/store/navigation-store/navigation.facade';
import { GuidelineFacade } from 'src/app/store/guideline-store/guideline.facade';


@Component({
  selector: 'app-gct-editor',
  templateUrl: './gct-editor.component.html',
  styleUrls: ['./gct-editor.component.scss']
})
export class GCTEditorComponent implements OnInit {
  public guidelineType = '';
  public guidelineId: number;
  public nodeMap$: Observable<NodeMap>;

  constructor(
    public navigationFacade: NavigationFacade,
    public guidelineFacade: GuidelineFacade,
    private _router: Router,
    private route: ActivatedRoute,
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    this._handleWindowEvent();
    this._configureRouteState();
    this._loadContent();
  }

  public addAppendixHandler(): void {
    console.log('Parent received event to add appendix');
  }

  private _loadContent(): void {
    this.guidelineFacade.load(this.guidelineId);
    this.nodeMap$ = this.store.select(selectNodeMap);
  }

  private _configureRouteState(): void {
    this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.guidelineType = params.guidelineType;
        this.guidelineId = parseInt(params.id, 10);
      });
  }

  private _handleWindowEvent(): void {
    window.addEventListener('popstate', (event) => {
      window.parent.postMessage(
        {
          event_id: 'current_route_message',
          route: '/'
        },
        '*' // or "www.parentpage.com"
      );
    });

    if (window.parent) {
      window.parent.postMessage(
        {
          event_id: 'current_route_message',
          route: this._router.url
        },
        '*' // or "www.parentpage.com"
      );
    }
  }
}
