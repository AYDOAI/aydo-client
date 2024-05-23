import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {ButtonComponent} from './elements/button/button.component';
import {InputComponent} from './elements/input/input.component';

import {AppComponent} from './app.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {WelcomeMainComponent} from './components/welcome/main/welcome-main.component';
import {WelcomeSignUpComponent} from './components/welcome/sign-up/welcome-sign-up.component';
import {WelcomeSignInComponent} from './components/welcome/sign-in/welcome-sign-in.component';
import {WelcomeForgotComponent} from './components/welcome/forgot/welcome-forgot.component';
import {CommonModule} from '@angular/common';
import {WelcomeNavigateComponent} from './components/welcome/navigate/welcome-navigate.component';
import {WelcomeService} from './services/welcome.service';
import {WelcomeProvidersComponent} from './components/welcome/providers/welcome-providers.component';
import {WelcomeAddHubComponent} from './components/welcome/add-hub/welcome-add-hub.component';
import {FormComponent} from './elements/form/form.component';
import {SafeHtmlPipe} from './shared/safe-html.pipe';

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

    ButtonComponent,
    InputComponent,
    FormComponent,
    SafeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CommonModule,
  ],
  providers: [
    WelcomeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}