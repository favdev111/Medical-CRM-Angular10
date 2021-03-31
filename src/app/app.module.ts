import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RootStoreModule } from './store/root-store.module';
import { GCTFileManagementModule } from './components/gct-file-management/gct-file-management.module';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NodeService } from './services/node.service';
import { D3Service } from './d3';
import { HttpSnackbarInterceptor } from 'src/app/interceptors/http-snackbar.interceptor';
import { AppAuthInterceptor } from './interceptors/auth.interceptor';
import { HostService } from './services/host.service';

// NAP Modules
//import { MessageDecoder, MessageEncoder } from '@nap/platform';
//import { AuthStoreModule } from '@nap/auth-store';
// import {
//   AuthServiceType,
//   DiaMessageEncoder,
//   DiaMessageDecoder,
//   PlatformClientModule
// } from '@nap/platform-client';
//import { APP_CONFIG } from '@nap/common';

//import { GCT_APP_CONFIG } from './app.const';

// Custom settings
// export const CUSTOM_PROVIDERS = [
//   {
//     provide: MessageDecoder,
//     useClass: DiaMessageDecoder,
//     deps: []
//   },
//   {
//     provide: MessageEncoder,
//     useClass: DiaMessageEncoder,
//     deps: []
//   }
// ];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //AuthStoreModule,
    // PlatformClientModule.forRoot({
    //   authServiceType: AuthServiceType.WITHOUT_LOGIN,
    //   customProviders: CUSTOM_PROVIDERS
    // }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    RootStoreModule,
    GCTFileManagementModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    NodeService,
    D3Service,
    //HostService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpSnackbarInterceptor,
      multi: true
    },
    // { provide: APP_CONFIG, useValue: GCT_APP_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
