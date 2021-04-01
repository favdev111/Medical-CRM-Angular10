import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { SwitchAppService } from '@nap/platform-client';
import { WindowEvent } from 'src/app/models/enums/window.event';

@Component({
  selector: 'app-exit-app',
  templateUrl: './exit-app.component.html',
  styleUrls: ['./exit-app.component.scss']
})
export class ExitAppComponent implements OnInit {

  public readonly GDL_UUID = '3';

  constructor(
    //private _switchAppService: SwitchAppService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    if (window.parent) {
      window.parent.postMessage(
        {
          event_id: WindowEvent.CURRENT_ROUTE_MESSAGE,
          route: this._router.url
        },
        '*' //or "www.parentpage.com"
      );
    }
  }

  public switchApp(uuid: string): void {
    //this._switchAppService.change(uuid);
  }

  public navigateToAST(): void {
    window.parent.postMessage(
      {
        event_id: WindowEvent.NAVIGATE_BACK
      },
      '*' //or "www.parentpage.com"
    );
  }
}
