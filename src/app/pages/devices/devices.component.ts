import {Component, inject} from '@angular/core';
import {BaseComponent} from '../../components/base.component';
import {DeviceItem} from '../../models/gateway.model';
import {ZoneService} from "../../services/zone.service";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent extends BaseComponent {
  private zoneService = inject(ZoneService);

  override onInit() {
    super.onInit();
    this.getDevices();
    this.ui.getDrivers();
    this.zoneService.load();
  }

  public getDevices(event: any = null) {
    this.ui.getDevices(event);
  }

  deviceAdd() {
    this.ui.goStep('add-device');
  }

  deviceCapabilitiesExists(device: DeviceItem) {
    return !!device.capabilities.find(item => this.capabilityExists(item))
  }

  capabilityExists(item: any) {
    return item.displayName !== 'Linkquality' && ['power', 'mode', 'motion', 'rgb'].indexOf(item.ident) === -1;
  }

  public edit(device: DeviceItem): void {
    this.ui.selectedDriver = this.ui.drivers.items.find(item => item.driverId == device.driverId);
    this.ui.selectedDevice = device;
    this.navCtrl.navigateForward(['/devices/edit'])
  }

  public trackByIdent(index: number, device: DeviceItem): string {
    return device.ident;
  }

  public zoneName(device: DeviceItem) {
    return this.zoneService.zones?.items?.find(item => (item as any).id === device.zoneId)?.name;
  }
}
