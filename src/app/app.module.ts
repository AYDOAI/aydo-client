import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {Storage} from '@ionic/storage';

import {AppComponent} from './app.component';

import {SafeHtmlPipe} from './shared/safe-html.pipe';
import {HttpHeadersInterceptor} from "./shared/http-headers.interceptor";

import {UIService} from './services/ui.service';
import {StorageService} from "./services/storage.service";

import {SvgDefinitionsComponent} from './elements/svg-definitions/svg-definitions.component';
import {SvgIconComponent} from './elements/svg-icon/svg-icon.component';
import {ButtonComponent} from './elements/button/button.component';
import {InputComponent} from './elements/input/input.component';
import {FormComponent} from './elements/form/form.component';

import {MainComponent} from './components/main/main.component';
import {WelcomeMainComponent} from './components/welcome/main/welcome-main.component';
import {WelcomeSignUpComponent} from './components/welcome/sign-up/welcome-sign-up.component';
import {WelcomeSignInComponent} from './components/welcome/sign-in/welcome-sign-in.component';
import {WelcomeForgotComponent} from './components/welcome/forgot/welcome-forgot.component';
import {WelcomeNavigateComponent} from './components/welcome/navigate/welcome-navigate.component';
import {WelcomeProvidersComponent} from './components/welcome/providers/welcome-providers.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {FormAddHubComponent} from './components/forms/add-hub/form-add-hub.component';
import {FormConfigHubComponent} from './components/forms/config-hub/form-config-hub.component';
import {FormAddDeviceComponent} from './components/forms/add-device/form-add-device.component';
import {FormEditDeviceComponent} from './components/forms/edit-device/form-edit-device.component';
import {FormProfileComponent} from './components/forms/profile/form-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    WelcomeMainComponent,
    WelcomeSignUpComponent,
    WelcomeSignInComponent,
    WelcomeForgotComponent,
    WelcomeNavigateComponent,
    WelcomeProvidersComponent,
    FormAddHubComponent,
    FormConfigHubComponent,
    FormAddDeviceComponent,
    FormEditDeviceComponent,
    FormProfileComponent,
    DashboardComponent,
    SvgDefinitionsComponent,
    SvgIconComponent,
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
    UIService,
    StorageService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
