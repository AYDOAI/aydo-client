import {Injectable} from '@angular/core';
import {WelcomeStep} from '../shared/types';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  step: WelcomeStep = 'add-hub';

  constructor() {
  }

}
