import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { WelcomeSignUpComponent } from './pages/welcome/sign-up/welcome-sign-up.component';
import { WelcomeSignInComponent } from './pages/welcome/sign-in/welcome-sign-in.component';
import { DevicesComponent } from './pages/devices/devices.component';
import { WelcomeForgotComponent } from './pages/welcome/forgot/welcome-forgot.component';
import { DemoComponent } from './pages/demo/demo.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AboutComponent } from './pages/about/about.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StreamsComponent } from './pages/streams/streams/streams.component';
import { StatusComponent } from './components/status/status.component';
import { HubComponent } from './pages/hub/hub.component';
import { FormAddHubComponent } from './components/forms/add-hub/form-add-hub.component';
import { FormAddHubAgreementComponent } from './components/forms/add-hub-agreement/form-add-hub-agreement.component';
import { FormAddHubTypeComponent } from './components/forms/add-hub-type/form-add-hub-type.component';
import { FormAddHubManuallyComponent } from './components/forms/add-hub-manually/form-add-hub-manually.component';
import { AutomaticallyComponent } from './pages/hub/automatically/automatically.component';
import { FormAddHubConnectedComponent } from './components/forms/add-hub-connected/form-add-hub-connected.component';
import { WelcomeMainComponent } from './pages/welcome/main/welcome-main.component';
import { DashboardRewardsComponent } from './pages/dashboard/rewards/dashboard-rewards.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardMainComponent } from './pages/dashboard/main/dashboard-main.component';
import { DashboardMainQuestsComponent } from './pages/dashboard/main-quests/dashboard-main-quests.component';
import { StreamsHomeComponent } from './pages/streams/streams-home';
import { AuthRedirectComponent } from './pages/auth-redirect/auth-redirect.component';
import { SuccessComponent } from './pages/welcome/success/success.component';
import { EditProfileComponent } from './pages/profile/edit/edit-profile.component';
import { ProjectInfoComponent } from './pages/project-info/project-info.component';
import { ConnectWalletComponent } from './pages/connect-wallet/connect-wallet.component';
import { ConnectDevicesComponent } from './pages/connect-devices/connect-devices.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { DeviceEditComponent } from './pages/devices/edit/device-edit.component';
import { AddZoneComponent } from './components/zone/add/add.component';
import { HubGuard } from './shared/guards/hub.guard';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { AddDeviceComponent } from './pages/devices/add/add-device.component';
import { NewDeviceComponent } from './pages/devices/new/new-device.component';
import { HubEditComponent } from './pages/devices/hub/hub-edit.component';
import { ProjectComponent } from './pages/streams/project/project.component';
import { ModalRedirectGuard } from './shared/guards/modal-redirect.guard';
import { UnauthGuard } from './shared/guards/unauth.guard';

export const routes: Routes = [
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: WelcomeSignInComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: 'sign-up',
    component: WelcomeSignUpComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: 'forgot-password',
    component: WelcomeForgotComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: 'success',
    component: SuccessComponent,
  },
  {
    path: 'auth-redirect',
    component: AuthRedirectComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardMainComponent,
      },
      {
        path: 'rewards',
        canActivate: [ModalRedirectGuard],
        component: DashboardRewardsComponent,
      },
      // {
      //   path: 'main-quests',
      //   component: DashboardMainQuestsComponent
      // },
      // {
      //   path: 'additional-quests',
      //   component: DashboardAdditionalQuestsComponent
      // },
      // {
      //   path: 'notifications',
      //   component: NotificationsComponent
      // }
    ],
  },
  {
    path: 'quests',
    component: DashboardMainQuestsComponent,
  },
  {
    path: 'devices',
    component: DevicesComponent,
    canActivate: [HubGuard],
  },
  {
    path: 'devices/edit',
    component: DeviceEditComponent,
    canActivate: [ModalRedirectGuard],
  },
  {
    path: 'devices/hub',
    component: HubEditComponent,
    canActivate: [ModalRedirectGuard],
  },
  {
    path: 'devices/add',
    component: AddDeviceComponent,
    canActivate: [HubGuard, ModalRedirectGuard],
  },
  {
    path: 'devices/new',
    component: NewDeviceComponent,
    canActivate: [ModalRedirectGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'profile',
    canActivate: [ModalRedirectGuard],
    component: ProfileComponent,
  },
  {
    path: 'profile/edit',
    canActivate: [ModalRedirectGuard],
    component: EditProfileComponent,
  },
  {
    path: 'streams',
    component: StreamsHomeComponent,
    children: [
      {
        path: '',
        component: StreamsComponent,
      },
      {
        path: ':id',
        component: ProjectComponent,
        canActivate: [ModalRedirectGuard],
      },
      {
        path: ':id/devices',
        component: ConnectDevicesComponent,
        canActivate: [ModalRedirectGuard],
      },
    ],
  },
  {
    path: 'status',
    component: StatusComponent,
  },
  {
    path: 'project-info',
    component: ProjectInfoComponent,
  },
  {
    path: 'connect-wallet',
    component: ConnectWalletComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [ModalRedirectGuard],
  },
  {
    path: 'feedback',
    canActivate: [ModalRedirectGuard],
    component: FeedbackComponent,
  },
  {
    path: 'demo',
    component: DemoComponent,
  },
  {
    path: 'add-hub',
    component: HubComponent,
    children: [
      {
        path: '',
        component: FormAddHubComponent,
      },
      {
        path: ':hub',
        component: FormAddHubAgreementComponent,
        canActivate: [ModalRedirectGuard],
      },
      {
        path: ':hub/search',
        component: FormAddHubTypeComponent,
      },
      {
        path: ':hub/search/automatically',
        component: AutomaticallyComponent,
      },
      {
        path: ':hub/search/manually',
        component: FormAddHubManuallyComponent,
        canActivate: [ModalRedirectGuard],
      },
      {
        path: ':hub/connected',
        component: FormAddHubConnectedComponent,
        canActivate: [ModalRedirectGuard],
      },
    ],
  },
  {
    path: 'zone/add',
    component: AddZoneComponent,
  },
  // desktop modal
  { path: 'feedback', component: FeedbackComponent, outlet: 'modal' },
  { path: 'profile', component: FeedbackComponent, outlet: 'modal' },
  { path: 'profile-edit', component: FeedbackComponent, outlet: 'modal' },
  { path: 'rewards', component: FeedbackComponent, outlet: 'modal' },
  { path: 'about', component: FeedbackComponent, outlet: 'modal' },
  { path: 'add-hub', component: FeedbackComponent, outlet: 'modal' },
  { path: 'devices-add', component: FeedbackComponent, outlet: 'modal' },
  { path: 'devices-new', component: FeedbackComponent, outlet: 'modal' },
  { path: 'device-edit', component: FeedbackComponent, outlet: 'modal' },
  { path: 'device-hub', component: FeedbackComponent, outlet: 'modal' },
  { path: 'stream/:id', component: FeedbackComponent, outlet: 'modal' },
  { path: 'stream/:id/devices', component: FeedbackComponent, outlet: 'modal' },
  { path: 'add-hub/:hub', component: FeedbackComponent, outlet: 'modal' },
  {
    path: 'add-hub/:hub/search/manually',
    component: FeedbackComponent,
    outlet: 'modal',
  },
  {
    path: 'add-hub/:hub/connected',
    component: FeedbackComponent,
    outlet: 'modal',
  },
  //
  { path: 'main', component: WelcomeMainComponent, canActivate: [UnauthGuard] },
  { path: '**', redirectTo: 'main' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],

  exports: [RouterModule],
})
export class AppRoutingModule {}
