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

import {SvgDefinitionsComponent} from './components/svg-definitions/svg-definitions.component';
import {SvgIconComponent} from './elements/svg-icon/svg-icon.component';
import {ButtonComponent} from './elements/button/button.component';
import {InputComponent} from './elements/input/input.component';
import { SelectComponent } from "./elements/select/select.component";
import {FormComponent} from './elements/form/form.component';

import {MainComponent} from './pages/main/main.component';
import {WelcomeMainComponent} from './pages/welcome/main/welcome-main.component';
import {WelcomeSignUpComponent} from './pages/welcome/sign-up/welcome-sign-up.component';
import {WelcomeSignInComponent} from './pages/welcome/sign-in/welcome-sign-in.component';
import {WelcomeForgotComponent} from './pages/welcome/forgot/welcome-forgot.component';
import {WelcomeNavigateComponent} from './pages/welcome/navigate/welcome-navigate.component';
import {WelcomeProvidersComponent} from './pages/welcome/providers/welcome-providers.component';
import {DevicesComponent} from './pages/devices/devices.component';
import {FormAddHubComponent} from './components/forms/add-hub/form-add-hub.component';
import {FormConfigHubComponent} from './components/forms/config-hub/form-config-hub.component';
import {FormAddDeviceComponent} from './components/forms/add-device/form-add-device.component';
import {FormEditDeviceComponent} from './components/forms/edit-device/form-edit-device.component';
import {DashboardMainComponent} from './pages/dashboard/main/dashboard-main.component';
import {HeaderComponent} from './elements/header/header.component';
import {AppRoutingModule} from './app.routes';
import {DemoComponent} from './pages/demo/demo.component';
import {AboutComponent} from './pages/about/about.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {StatusComponent} from './components/status/status.component';
import {StreamsComponent} from './pages/streams/streams/streams.component';
import {HubComponent} from './pages/hub/hub.component';
import {CheckboxComponent} from './elements/checkbox/checkbox.component';
import {FormHeaderComponent} from './elements/form-header/form-header.component';
import {FormAddHubAgreementComponent} from './components/forms/add-hub-agreement/form-add-hub-agreement.component';
import {FormAddHubTypeComponent} from './components/forms/add-hub-type/form-add-hub-type.component';
import {FormAddHubSearchComponent} from './components/forms/add-hub-search/form-add-hub-search.component';
import {FormAddHubManuallyComponent} from './components/forms/add-hub-manually/form-add-hub-manually.component';
import {AutomaticallyComponent} from './pages/hub/automatically/automatically.component';
import {FormAddHubFoundComponent} from './components/forms/add-hub-found/form-add-hub-found.component';
import {FormAddHubConnectedComponent} from './components/forms/add-hub-connected/form-add-hub-connected.component';
import {DashboardRewardsComponent} from './pages/dashboard/rewards/dashboard-rewards.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import { IonicModule } from '@ionic/angular';
import {DashboardMainQuestsComponent} from './pages/dashboard/main-quests/dashboard-main-quests.component';
import {DashboardQuestsComponent} from './pages/dashboard/quests/dashboard-quests.component';
import {
  DashboardAdditionalQuestsComponent
} from './pages/dashboard/additional-quests/dashboard-additional-quests.component';
import { NotificationsComponent } from './pages/dashboard/notification/notifications.component';
import { DialogModule } from './elements/dialog/dialog.module';
import { BarcodeScannerComponent } from './elements/barcode-scanner/barcode-scanner.component';
import { StreamsHomeComponent } from './pages/streams/streams-home';
import { ProjectComponent } from './pages/streams/project/project.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GoogleAuthRedirectComponent } from "./pages/google-auth-redirect/google-auth-redirect.component";
import { SuccessComponent } from "./pages/welcome/success/success.component";
import { EditProfileComponent } from "./pages/profile/edit/edit-profile.component";
import { ProjectInfoComponent } from "./pages/project-info/project-info.component";
import { LinkContainerComponent } from "./elements/link-container/link-container.component";
import { ConnectWalletComponent } from "./pages/connect-wallet/connect-wallet.component";
import { ConnectDevicesComponent } from "./pages/connect-devices/connect-devices.component";
import { DeviceCardComponent } from "./pages/connect-devices/card/device-card.component";
import { RecaptchaComponent } from "./elements/recaptcha/recaptcha.component";
import { NgxCaptchaModule } from "ngx-captcha";
import {FeedbackComponent} from './pages/feedback/feedback.component';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {GoogleMapComponent} from './elements/google-map/google-map.component';
import { ContentModule } from "./components/content/content.module";


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
    GoogleAuthRedirectComponent,
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
    SelectComponent,
    CheckboxComponent,
    FormComponent,
    HeaderComponent,
    DemoComponent,
    AboutComponent,
    FeedbackComponent,
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
    NotificationsComponent,
    BarcodeScannerComponent,
    StreamsHomeComponent,
    ProjectComponent,
    ProjectInfoComponent,
    LinkContainerComponent,
    ConnectWalletComponent,
    ConnectDevicesComponent,
    DeviceCardComponent,
    EditProfileComponent,
    SuccessComponent,
    SafeHtmlPipe,
    RecaptchaComponent,
    GoogleMapComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    DialogModule,
    NgxCaptchaModule,
    GoogleMap,
    MapMarker,
    ContentModule
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
