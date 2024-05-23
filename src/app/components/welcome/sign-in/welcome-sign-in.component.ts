import {Component, Input} from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';

@Component({
  selector: 'app-welcome-sign-in',
  templateUrl: './welcome-sign-in.component.html',
  styleUrl: './welcome-sign-in.component.scss'
})
export class WelcomeSignInComponent extends WelcomeBaseComponent {

  @Input() title = '';

}
