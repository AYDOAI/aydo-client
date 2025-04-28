import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../components/base.component';
import { DeviceItem } from '../../models/gateway.model';
import { ZoneService } from '../../services/zone.service';
import { DevicesService } from '../../services/devices.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
})
export class DevicesComponent extends BaseComponent {
  private zoneService = inject(ZoneService);
  private devicesService = inject(DevicesService);

  override onInit() {
    super.onInit();
    this.getDevices();
    this.ui.getDrivers();
    this.zoneService.load();
  }

  public getDevices(event: any = null) {
    this.ui.getGateway(() => this.ui.getDevices(event));
  }

  public edit(device: DeviceItem): void {
    this.ui.selectedDriver = this.ui.drivers.items.find(
      item => item.driverId == device.driverId
    );
    this.ui.selectedDevice = device;
    this.devicesService.selectDevice(device);
    this.navCtrl.navigateForward('/devices/edit');
  }

  public editHub(): void {
    this.navCtrl.navigateForward('/devices/hub');
  }

  public addDevice(): void {
    this.navCtrl.navigateForward('/devices/add');
  }

  public trackByIdent(index: number, device: DeviceItem): string {
    return device.ident;
  }
}
