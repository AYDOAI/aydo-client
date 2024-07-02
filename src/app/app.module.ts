import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {Storage} from '@ionic/storage';

import {AppComponent} from './app.component';

import {SafeHtmlPipe} from './shared/safe-html.pipe';

import {WelcomeService} from './services/welcome.service';

import {ButtonComponent} from './elements/button/button.component';
import {InputComponent} from './elements/input/input.component';
import {FormComponent} from './elements/form/form.component';

import {WelcomeComponent} from './components/welcome/welcome.component';
import {WelcomeMainComponent} from './components/welcome/main/welcome-main.component';
import {WelcomeSignUpComponent} from './components/welcome/sign-up/welcome-sign-up.component';
import {WelcomeSignInComponent} from './components/welcome/sign-in/welcome-sign-in.component';
import {WelcomeForgotComponent} from './components/welcome/forgot/welcome-forgot.component';
import {WelcomeNavigateComponent} from './components/welcome/navigate/welcome-navigate.component';
import {WelcomeProvidersComponent} from './components/welcome/providers/welcome-providers.component';
import {WelcomeAddHubComponent} from './components/welcome/add-hub/welcome-add-hub.component';
import {StorageService} from "./services/storage.service";
import {HttpHeadersInterceptor} from "./shared/http-headers.interceptor";
import {WelcomeConfigHubComponent} from './components/welcome/config-hub/welcome-config-hub.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    WelcomeMainComponent,
    WelcomeSignUpComponent,
    WelcomeSignInComponent,
    WelcomeForgotComponent,
    WelcomeNavigateComponent,
    WelcomeAddHubComponent,
    WelcomeProvidersComponent,
    WelcomeConfigHubComponent,

    DashboardComponent,

    ButtonComponent,
    InputComponent,
    FormComponent,
    SafeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    Storage,
    WelcomeService,
    StorageService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
