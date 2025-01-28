import { Component, ElementRef } from '@angular/core';
import { UIService } from '../services/ui.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-base',
  template: '',
})
export class BaseElement {
  constructor(
    protected readonly element: ElementRef<HTMLElement>,
    readonly ui: UIService,
    readonly router: Router,
    readonly navCtrl: NavController
  ) {}
}
