import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BaseElement} from '../base.component';
import {FrameStep} from '../../shared/types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends BaseElement {

  @Input() title = '';
  @Input() add: FrameStep = '';

  menu = [
    {key: 'dashboard', icon: 'menu-unknown', title: 'Dashboard', step: 'dashboard'},
    {key: 'devices', icon: 'menu-devices', title: 'Devices', step: 'devices'},
    {key: 'settings', icon: 'menu-hub-settings', title: 'Hub settings'},
    {key: 'profile', icon: 'menu-profile', title: 'Profile', step: 'profile'},
    {key: 'status', icon: 'menu-service-status', title: 'Services status'},
    {key: 'streams', icon: 'menu-unknown', title: 'Data streams'},
    {key: 'about', icon: 'menu-about', title: 'About'},
  ];
  menuVisible = false;

  showHideMenu() {
    this.menuVisible = !this.menuVisible;
  }

  clickMenu(item: any) {
    if (item.step) {
      this.ui.goStep(item.step);
    }
  }

  addClick() {
    this.ui.goStep(this.add);
  }

}
