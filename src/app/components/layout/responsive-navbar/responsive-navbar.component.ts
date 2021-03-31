import { Component, OnInit, Input } from '@angular/core';
//import { AuthService } from 'src/app/auth/auth.service';
import { UserProfileFacade } from 'src/app/store/user-profile-store/userprofile.facade';

@Component({
  selector: 'app-responsive-navbar',
  templateUrl: './responsive-navbar.component.html',
  styleUrls: ['./responsive-navbar.component.scss']
})
export class ResponsiveNavbarComponent implements OnInit {  
  appDisplayName = 'Guidelines Configuration Module';
  
  @Input() userDisplayName: string;
  
  constructor(
    public userProfileFacade: UserProfileFacade,
    //private _authService: AuthService
  ) { }

  ngOnInit(): void { }

  logout() {
    //this._authService.doLogout();
  }

}
