import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
//import { AUTH_EVENT_SESSION_START, AuthEvent } from '@dia/auth';

//import { AuthService } from './auth/auth.service';
import { environment } from 'src/environments/environment';
import { GCT_API_LOCAL_STORAGE_KEY } from './constants';
import { UserProfile } from './models/business/user-profile';
import { NavigationFacade } from 'src/app/store/navigation-store/navigation.facade';
import { UserProfileFacade } from './store/user-profile-store/userprofile.facade';
import { WindowEvent } from './models/enums/window.event';
import { isSelfHosted } from './auth/utils/auth.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public userProfile: UserProfile;
  public userDisplayName: string;

  private _subscription: Subscription = new Subscription();

  constructor(
    public navigationFacade: NavigationFacade,
    private _userProfileFacade: UserProfileFacade,
    //private _authService: AuthService
  ) {

  }

  ngOnInit(): void {
    // // To make GCT standalone app it needs its own auth
    // if (environment.production && isSelfHosted()) {
    //   this.navigationFacade.setIsStandAloneMode(true);
    //   //this._authService.configure().then(() =>
    //     this._subscription.add(
    //       //this._authService.auth.subscribe((event: AuthEvent) => {
    //         if (event.type === AUTH_EVENT_SESSION_START) {
    //           this._authService.userSession.subscribe((value: any) => {
    //             if (value.profile) {
    //               this._userProfileFacade.setUserProfile(value.profile);
    //             }
    //           });
    //         }
    //       })
    //     )
    //   );
    // }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  @HostListener('window:message', ['$event'])
  onMessageRecieved(event: any) {
    if (event.data.event_id === WindowEvent.CONTEXT_MESSAGE) {
      if (event.data.api_url) {
        localStorage.setItem(GCT_API_LOCAL_STORAGE_KEY, event.data.api_url);
      }
      if (event.data.user_profile) {
        this._userProfileFacade.setUserProfile(event.data.user_profile);
      }
    }
  }

}
