import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GCT_APP_VERSION } from 'src/app/constants';

import { State } from 'src/app/store/guideline-store/guideline.reducer'; 
import { selectAppVersion } from 'src/app/store/guideline-store/guideline.selectors';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  footerText$: Subscription;
  footerText: string = localStorage.getItem(GCT_APP_VERSION);

  constructor(private store: Store<State>) {
    if (!this.footerText) {
      this.footerText$ = this.store.select(selectAppVersion).subscribe((appVersion) => {
        this.footerText = appVersion;
      });
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.footerText$) {
      this.footerText$.unsubscribe();
    }
  }
}
