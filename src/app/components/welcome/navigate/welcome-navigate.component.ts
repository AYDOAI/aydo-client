import {Component, Input} from '@angular/core';
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-welcome-navigate',
  templateUrl: './welcome-navigate.component.html',
  styleUrl: './welcome-navigate.component.scss'
})
export class WelcomeNavigateComponent extends FormBaseComponent {

  @Input() signIn = false;
  @Input() signUp = false;
  @Input() demo = false;
  @Input() forgot = false;

}
