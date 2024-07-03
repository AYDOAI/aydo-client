import {Component, ElementRef} from '@angular/core';
import {UIService} from '../services/ui.service';

@Component({
  selector: 'app-base',
  template: '',
})
export class BaseElement {

  constructor(protected readonly element: ElementRef<HTMLElement>,
              readonly ui: UIService) {

  }

}
