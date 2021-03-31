import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationFacade } from 'src/app/store/navigation-store/navigation.facade';

@Component({
  selector: 'app-gct-file-management',
  templateUrl: './gct-file-management.component.html',
  styleUrls: ['./gct-file-management.component.scss']
})
export class GCTFileManagementComponent implements OnInit {
  constructor(
    public navigationFacade: NavigationFacade,
    private _router: Router
  ) {}

    ngOnInit(): void { } 

  public navigateToGCTEditor(): void {
    this._router.navigate([{ outlets: { GCTElement: 'editor' } }]);
  }
}
