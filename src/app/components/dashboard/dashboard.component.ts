import {Component} from '@angular/core';
import {BaseComponent} from '../base.component';
import {DeviceItem} from '../../models/gateway.model';

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

  deviceCapabilitiesExists(device: DeviceItem) {
    return !!device.capabilities.find(item => this.capabilityExists(item))
  }

  capabilityExists(item: any) {
    return item.displayName !== 'Linkquality' && item.value && ['power', 'mode', 'motion', 'rgb'].indexOf(item.ident) === -1;
  }

}
