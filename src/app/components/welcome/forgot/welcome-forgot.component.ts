import {Component} from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppForm} from '../../../shared/types';

@Component({
  selector: 'app-welcome-forgot',
  templateUrl: './welcome-forgot.component.html',
  styleUrl: './welcome-forgot.component.scss'
})
export class WelcomeForgotComponent extends WelcomeBaseComponent {

  override form: AppForm = {
    title: 'Forgot password?',
    // @ts-ignore
    inputs: [
      {key: '', title: 'E-mail', type: 'input'},
      {key: '', title: 'Send recovery link', type: 'button', color: 'white', backgroundColor: '#060022'},
    ]
  };

}
