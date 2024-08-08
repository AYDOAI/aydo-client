import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {DashboardComponent} from "./components/dashboard/main/dashboard.component";
import {WelcomeMainComponent} from "./components/welcome/main/welcome-main.component";
import {WelcomeSignUpComponent} from "./components/welcome/sign-up/welcome-sign-up.component";
import {WelcomeSignInComponent} from "./components/welcome/sign-in/welcome-sign-in.component";
import {DevicesComponent} from "./components/devices/devices.component";
import {WelcomeForgotComponent} from "./components/welcome/forgot/welcome-forgot.component";
import {DemoComponent} from "./components/demo/demo.component";
import {SettingsComponent} from "./components/settings/settings.component";
import {AboutComponent} from "./components/about/about.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {StreamsComponent} from "./components/streams/streams.component";
import {StatusComponent} from "./components/status/status.component";
import {MainComponent} from './components/main/main.component';

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
    component: StreamsComponent,
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
  { path: '**', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}
