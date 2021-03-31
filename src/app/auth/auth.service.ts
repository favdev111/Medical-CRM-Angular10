// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { combineLatest, BehaviorSubject } from 'rxjs';
// import { map, tap } from 'rxjs/operators';
// import {
//   AuthEvent,
//   AUTH_EVENT_BEFORE_LOGIN,
//   AUTH_EVENT_AFTER_LOGIN,
//   AUTH_EVENT_BEFORE_SESSION_EXPIRATION,
//   AUTH_EVENT_SESSION_EXPIRATION,
//   Auth
// } from '@dia/auth';
// import { getTenantFromHost, HEADER_TENANT_ID } from './utils/auth.utils';
// import { APIResponse } from '../models/http';
// import { environment } from 'src/environments/environment';

// interface AuthConfig {
//   platformUrl: string;
//   appAlias: string;
//   platformAuthUrl: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   constructor(private http: HttpClient) { }

//   public auth: Auth;
//   public userSession = new BehaviorSubject({});

//   private sessionTimeout: number;
//   private lastActivityTime: number;

//   checkLogin() {
//     return false;
//   }

//   setAuth(authConfig: AuthConfig): void {
//     const tenantAlias = getTenantFromHost();
//     localStorage.setItem(HEADER_TENANT_ID, tenantAlias);
//     this.auth = new Auth({
//         platform: {
//           url:  authConfig.platformUrl // Navify Platform URL
//         },
//         app: {
//           url: authConfig.platformAuthUrl, // Auth-UI URL
//         },
//         client: {
//           /** Client application alias. */
//           appAlias: authConfig.appAlias,
//           /** Client tenant alias */
//           tenantAlias: tenantAlias !== 'ui' ? tenantAlias : 'local'
//         }
//         }, {
//         customPageTitle: 'CDS GCM Authentication',
//         customHeadline: '<strong>NAVIFY<sup>®</sup></strong> Guidelines Configuration Module',
//         customFooter: '<div class=""><a href="http://roche.com">Roche</a>CPS</div>',
//       }
//     );
//   }

//   async configure(): Promise<void> {
//     return await this.http
//       .get(`${environment.apiUrl}/ui-configuration`)
//       .pipe(
//         map((res: APIResponse) => this.setAuth(res.object as unknown as AuthConfig)),
//         tap(() => this.doAuth())
//       ).toPromise();
//   }

//   async doAuth() {
//     await this.auth.init().then(() => {
//       this.checkSession();
//     }); // instantiate the library object

//     this.auth.subscribe((event: AuthEvent) => {
//       if (event.type === AUTH_EVENT_BEFORE_LOGIN) {
//         document.body.style.overflow = 'hidden'; // TODO implement nicely
//       } else if (event.type === AUTH_EVENT_AFTER_LOGIN) {
//         this.checkSession();
//       } else if (event.type === AUTH_EVENT_BEFORE_SESSION_EXPIRATION) {
//         this.handleBeforeLogout();
//       } else if (event.type === AUTH_EVENT_SESSION_EXPIRATION) {
//         this.doLogout();
//       }
//     });
//   }

//   checkSession(loggedOut = false) {
//     combineLatest([this.auth.getSession(), this.auth.getLoginReturn()]).subscribe(
//       async ([session, loginResult]) => {
//         if ((session || loginResult) && !loggedOut) { 
//           this.userSession.next(session);
//           this.sessionTimeout = session.expiresAt;
//         } else {
//           this.doLogin();
//         }
//       },
//       (err) => {
//         this.doLogin();
//         throw err;
//       }
//     );
//   }

//   private handleBeforeLogout() {
//     const nowTime: number = new Date().getTime();
//     const sessionIdleTime: number = nowTime - this.lastActivityTime;

//     if (sessionIdleTime <= this.sessionTimeout) {
//       this.auth.refreshSession().then(({ expiresAt }) => {
//         this.lastActivityTime = 0;
//         this.sessionTimeout = expiresAt;
//       });
//     }
//   }

//   public doLogout(): void {
//     this.auth.logout().then((st) => {
//         document.location.reload();
//     });
// }

//   async doLogin() {
//     await this.auth.loginIframe({
//       state: 'something to preserve',
//       reason: null,
//     });
//   }

//   public logOut(): void {
//     this.auth.logout();
//   }

//   public keepAlive() {
//     this.lastActivityTime = new Date().getTime();
//   }
  
// }
