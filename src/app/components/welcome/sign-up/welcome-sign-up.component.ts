import {Component} from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppForm} from '../../../shared/types';

@Component({
  selector: 'app-welcome-sign-up',
  templateUrl: './welcome-sign-up.component.html',
  styleUrl: './welcome-sign-up.component.scss'
})
export class WelcomeSignUpComponent extends WelcomeBaseComponent {

  form: AppForm = {
    title: 'Sign up',
    // @ts-ignore
    inputs: [
      {title: 'First name', type: 'input'},
      {title: 'Last name', type: 'input'},
      {title: 'E-mail', type: 'input'},
      {title: 'Password', type: 'input'},
      {title: 'Sign up', type: 'button', color: 'white', backgroundColor: '#060022'},
    ]
  };

}
