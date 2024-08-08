import {Component} from '@angular/core';
import {BaseComponent} from '../base.component';
import {DeviceItem} from '../../models/gateway.model';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent extends BaseComponent {

  menu = [
    {key: 'settings', icon: 'menu-hub-settings', title: 'Hub settings'},
    {key: 'profile', icon: 'menu-profile', title: 'Profile'},
    {key: 'status', icon: 'menu-service-status', title: 'Services status'},
    {key: 'statistics', icon: 'menu-statistics', title: 'Statistics'},
    {key: 'about', icon: 'menu-about', title: 'About'},
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

  clickMenu(item: any) {
    switch (item.key) {
      case 'profile':
        this.ui.step = 'profile';
        break;
    }
  }

}
