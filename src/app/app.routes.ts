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

export const routes: Routes = [
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: WelcomeSignInComponent,
  },
  {
    path: 'sign-up',
    component: WelcomeSignUpComponent,
  },
  {
    path: 'forgot-password',
    component: WelcomeForgotComponent,
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
  },
  {
    path: 'devices/hub',
    component: HubEditComponent,
  },
  {
    path: 'devices/add',
    component: AddDeviceComponent,
    canActivate: [HubGuard],
  },
  {
    path: 'devices/new',
    component: NewDeviceComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'profile/edit',
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
      },
      {
        path: ':id/devices',
        component: ConnectDevicesComponent,
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
  },
  {
    path: 'feedback',
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
      },
      {
        path: ':hub/connected',
        component: FormAddHubConnectedComponent,
      },
    ],
  },
  {
    path: 'zone/add',
    component: AddZoneComponent,
  },
  { path: 'main', component: WelcomeMainComponent },
  { path: '**', redirectTo: 'main' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],

  exports: [RouterModule],
})
export class AppRoutingModule {}
