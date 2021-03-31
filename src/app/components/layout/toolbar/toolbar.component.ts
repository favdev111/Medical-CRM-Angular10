import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NavigationFacade } from 'src/app/store/navigation-store/navigation.facade';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  public isReviewMode = false;

  private destroyed$ = new Subject<boolean>();

  @Input() guidelineType: string;

  @Output() addAppendix = new EventEmitter();

  constructor(
    public navigationFacade: NavigationFacade,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.navigationFacade.isReviewMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(isReviewMode => {
        this.isReviewMode = isReviewMode;
      });
  }

  navigateToFileManagement() {
    this.navigationFacade.resetNavigationToDefaults();
    this._router.navigate(['/']);
  }

  addAppendixHandler(): void {
    this.addAppendix.emit();
  }

  previewHandler(): void {
    if (this.isReviewMode) {
      this.navigateToFileManagement();
    } else {
      this.navigationFacade.toggleIsPreviewMode();
      this.navigationFacade.setIsReviewMode(false);
    }
  }
}
