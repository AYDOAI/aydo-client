import {Component} from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppForm} from '../../../shared/types';

@Component({
  selector: 'app-welcome-forgot',
  templateUrl: './welcome-forgot.component.html',
  styleUrl: './welcome-forgot.component.scss'
})
export class WelcomeForgotComponent extends WelcomeBaseComponent {

  form: AppForm = {
    title: 'Forgot password?',
    // @ts-ignore
    inputs: [
      {title: 'E-mail', type: 'input'},
      {title: 'Send recovery link', type: 'button', color: 'white', backgroundColor: '#060022'},
    ]
  };

}
