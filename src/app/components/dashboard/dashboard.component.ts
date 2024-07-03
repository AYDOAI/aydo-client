import {Component} from '@angular/core';
import {BaseComponent} from '../base.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent {

  menu = [
    {icon: 'menu-hub-settings', title: 'Hub settings'},
    {icon: 'menu-profile', title: 'Profile'},
    {icon: 'menu-service-status', title: 'Services status'},
    {icon: 'menu-statistics', title: 'Statistics'},
    {icon: 'menu-about', title: 'About'},
  ];
  menuVisible = false;

  showHideMenu() {
    this.menuVisible = !this.menuVisible;
  }

  deviceAdd() {
    this.ui.step = 'add-device';
  }

}
