import {Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-base',
  template: '',
})
export class BaseElement {

  constructor(protected readonly element: ElementRef<HTMLElement>) {

  }

}
