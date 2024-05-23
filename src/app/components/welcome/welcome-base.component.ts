import {Component} from '@angular/core';
import {WelcomeService} from '../../services/welcome.service';
import {WelcomeStep} from '../../shared/types';

@Component({
  selector: 'app-welcome-base',
  template: '',
})
export class WelcomeBaseComponent {

  constructor(public service: WelcomeService) {

  }

  select(event: WelcomeStep) {
    switch (event) {
      case 'demo':
        console.log('not implemented yet');
        break;
      default:
        this.service.step = event;
        break;
    }
  }
}
