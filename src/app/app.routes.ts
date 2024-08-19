import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {WelcomeSignUpComponent} from './components/welcome/sign-up/welcome-sign-up.component';
import {WelcomeSignInComponent} from './components/welcome/sign-in/welcome-sign-in.component';
import {DevicesComponent} from './components/devices/devices.component';
import {WelcomeForgotComponent} from './components/welcome/forgot/welcome-forgot.component';
import {DemoComponent} from './components/demo/demo.component';
import {SettingsComponent} from './components/settings/settings.component';
import {AboutComponent} from './components/about/about.component';
import {ProfileComponent} from './components/profile/profile.component';
import {StreamsComponent} from './components/streams/streams/streams.component';
import {StatusComponent} from './components/status/status.component';
import {HubComponent} from './components/hub/hub.component';
import {FormAddHubComponent} from './components/forms/add-hub/form-add-hub.component';
import {FormAddHubAgreementComponent} from './components/forms/add-hub-agreement/form-add-hub-agreement.component';
import {FormAddHubTypeComponent} from './components/forms/add-hub-type/form-add-hub-type.component';
import {FormAddHubManuallyComponent} from './components/forms/add-hub-manually/form-add-hub-manually.component';
import {AutomaticallyComponent} from './components/hub/automatically/automatically.component';
import {FormAddHubConnectedComponent} from './components/forms/add-hub-connected/form-add-hub-connected.component';
import {WelcomeMainComponent} from './components/welcome/main/welcome-main.component';
import {DashboardRewardsComponent} from './components/dashboard/rewards/dashboard-rewards.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {DashboardMainComponent} from './components/dashboard/main/dashboard-main.component';
import {DashboardMainQuestsComponent} from './components/dashboard/main-quests/dashboard-main-quests.component';
import {
  DashboardAdditionalQuestsComponent
} from './components/dashboard/additional-quests/dashboard-additional-quests.component';
import { NotificationsComponent } from './components/dashboard/notification/notifications.component';
import { StreamsHomeComponent } from './components/streams/streams-home';
import { ProjectComponent } from './components/streams/project/project.component';

const routes: Routes = [
  {
    path: 'sign-in',
    component: WelcomeSignInComponent
  },
  {
    path: 'sign-up',
    component: WelcomeSignUpComponent
  },
  {
    path: 'forgot-password',
    component: WelcomeForgotComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardMainComponent
      },
      {
        path: 'rewards',
        component: DashboardRewardsComponent
      },
      {
        path: 'main-quests',
        component: DashboardMainQuestsComponent
      },
      {
        path: 'additional-quests',
        component: DashboardAdditionalQuestsComponent
      },
      {
        path: 'notifications',
        component: NotificationsComponent
      }
    ]
  },
  {
    path: 'devices',
    component: DevicesComponent,
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
    path: 'streams',
    component: StreamsHomeComponent,
    children: [
      {
        path: '',
        component: StreamsComponent
      },
      {
        path: ':project',
        component: ProjectComponent
      }
    ]
  },
  {
    path: 'status',
    component: StatusComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
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
        component: FormAddHubComponent
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
        component: FormAddHubConnectedComponent
      }
    ]
  },
  {path: '**', component: WelcomeMainComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {
}
