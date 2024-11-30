import {Component, Input} from '@angular/core';
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
  @Input() back: string = '';

  menu = [
    {link: '/streams', icon: 'menu-unknown', title: 'Data streams'},
    // {link:'/dashboard', icon: 'menu-unknown', title: 'Dashboard', step: 'dashboard'},
    {link:'/devices', icon: 'menu-devices', title: 'Devices', step: 'devices'},
    // {link: '/settings', icon: 'menu-hub-settings', title: 'Hub settings'},
    {link: '/add-hub', icon: 'menu-hub-settings', title: 'Add hub'},
    {link: '/profile', icon: 'menu-profile', title: 'Profile', step: 'profile'},
    // {link: '/status', icon: 'menu-service-status', title: 'Services status'},
    {link: '/feedback', icon: 'menu-unknown', title: 'Feedback'},
    {link: '/about', icon: 'menu-about', title: 'About'},
  ];
  menuVisible = false;

  showHideMenu() {
    this.menuVisible = !this.menuVisible;
  }

  clickMenu(item: any) {
    if (item.link) {
      this.menuVisible = false;
      this.navCtrl.navigateForward([item.link])
    }
  }

  addClick() {
    this.ui.goStep(this.add);
  }

  public backClick(): void {
    this.navCtrl.navigateForward([this.back]);
  }

}
