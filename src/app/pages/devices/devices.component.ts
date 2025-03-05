import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../components/base.component';
import { DeviceItem } from '../../models/gateway.model';
import { ZoneService } from '../../services/zone.service';
import { DevicesService } from '../../services/devices.service';
import { SocketService } from '../../services/socket.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
})
export class DevicesComponent extends BaseComponent {
  private zoneService = inject(ZoneService);
  private devicesService = inject(DevicesService);
  private socket = inject(SocketService);

  override onInit() {
    super.onInit();
    this.getDevices();
    this.ui.getDrivers();
    this.zoneService.load();
    this.socket.updateDevices$.pipe(takeUntil(this.destroy$)).subscribe(() =>
      this.ui.getGateway(() => {
        this.ui.getDevices();
      })
    );
    this.socket.updateDeviceValues$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.ui.getDeviceValues());
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
    this.navCtrl.navigateForward(['/devices/edit']);
  }

  public editHub(): void {
    this.navCtrl.navigateForward(['/devices/hub']);
  }

  public trackByIdent(index: number, device: DeviceItem): string {
    return device.ident;
  }
}
