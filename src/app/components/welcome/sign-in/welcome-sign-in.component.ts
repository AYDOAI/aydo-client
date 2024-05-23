import {Component, Input} from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppForm} from '../../../shared/types';

@Component({
  selector: 'app-welcome-sign-in',
  templateUrl: './welcome-sign-in.component.html',
  styleUrl: './welcome-sign-in.component.scss'
})
export class WelcomeSignInComponent extends WelcomeBaseComponent {

  @Input() title = '';
  form: AppForm = {
    title: 'Sign in',
    // @ts-ignore
    inputs: [
      {title: 'E-mail', type: 'input'},
      {title: 'Password', type: 'input'},
      {title: 'Sign in', type: 'button', color: 'white', backgroundColor: '#060022'},
    ]
  };

}
