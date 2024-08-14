import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {Storage} from '@ionic/storage';

import {AppComponent} from './app.component';

import {SafeHtmlPipe} from './shared/safe-html.pipe';
import {HttpHeadersInterceptor} from './shared/http-headers.interceptor';

import {UIService} from './services/ui.service';
import {StorageService} from './services/storage.service';

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
import {DevicesComponent} from './components/devices/devices.component';
import {FormAddHubComponent} from './components/forms/add-hub/form-add-hub.component';
import {FormConfigHubComponent} from './components/forms/config-hub/form-config-hub.component';
import {FormAddDeviceComponent} from './components/forms/add-device/form-add-device.component';
import {FormEditDeviceComponent} from './components/forms/edit-device/form-edit-device.component';
import {DashboardMainComponent} from './components/dashboard/main/dashboard-main.component';
import {HeaderComponent} from './elements/header/header.component';
import {AppRoutingModule} from './app.routes';
import {DemoComponent} from './components/demo/demo.component';
import {AboutComponent} from './components/about/about.component';
import {SettingsComponent} from './components/settings/settings.component';
import {ProfileComponent} from './components/profile/profile.component';
import {StatusComponent} from './components/status/status.component';
import {StreamsComponent} from './components/streams/streams.component';
import {HubComponent} from './components/hub/hub.component';
import {CheckboxComponent} from './elements/checkbox/checkbox.component';
import {FormHeaderComponent} from './elements/form-header/form-header.component';
import {FormAddHubAgreementComponent} from './components/forms/add-hub-agreement/form-add-hub-agreement.component';
import {FormAddHubTypeComponent} from './components/forms/add-hub-type/form-add-hub-type.component';
import {FormAddHubSearchComponent} from './components/forms/add-hub-search/form-add-hub-search.component';
import {FormAddHubManuallyComponent} from './components/forms/add-hub-manually/form-add-hub-manually.component';
import {AutomaticallyComponent} from './components/hub/automatically/automatically.component';
import {FormAddHubFoundComponent} from './components/forms/add-hub-found/form-add-hub-found.component';
import {FormAddHubConnectedComponent} from './components/forms/add-hub-connected/form-add-hub-connected.component';
import {DashboardRewardsComponent} from './components/dashboard/rewards/dashboard-rewards.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import { IonicModule } from '@ionic/angular';
import {DashboardMainQuestsComponent} from './components/dashboard/main-quests/dashboard-main-quests.component';
import {DashboardQuestsComponent} from './components/dashboard/quests/dashboard-quests.component';
import {
  DashboardAdditionalQuestsComponent
} from './components/dashboard/additional-quests/dashboard-additional-quests.component';
import { DialogModule } from './elements/dialog/dialog.module';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    DashboardMainComponent,
    DashboardRewardsComponent,
    DashboardQuestsComponent,
    DashboardMainQuestsComponent,
    DashboardAdditionalQuestsComponent,
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
    DevicesComponent,
    SvgDefinitionsComponent,
    SvgIconComponent,
    ButtonComponent,
    InputComponent,
    CheckboxComponent,
    FormComponent,
    HeaderComponent,
    DemoComponent,
    AboutComponent,
    SettingsComponent,
    ProfileComponent,
    StatusComponent,
    StreamsComponent,
    HubComponent,
    FormHeaderComponent,
    FormAddHubAgreementComponent,
    FormAddHubTypeComponent,
    FormAddHubSearchComponent,
    FormAddHubManuallyComponent,
    AutomaticallyComponent,
    FormAddHubFoundComponent,
    FormAddHubConnectedComponent,
    SafeHtmlPipe,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    DialogModule
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
