import {Component} from '@angular/core';
import {BaseComponent} from '../base.component';
import {DeviceItem} from '../../models/gateway.model';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent extends BaseComponent {

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
