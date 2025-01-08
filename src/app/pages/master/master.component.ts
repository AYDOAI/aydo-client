import {Component} from '@angular/core';
import { BaseComponent } from "../../components/base.component";
import { DeviceItem } from "../../models/gateway.model";

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent extends BaseComponent {
  override onInit() {
    super.onInit();
    this.ui.getDrivers();
  }

  public edit(device: DeviceItem): void {
    this.ui.selectedDriver = this.ui.drivers.items.find(item => item.driverId == device.driverId);
    this.ui.selectedDevice = device;
    this.router.navigate(['/master/edit'])
  }
}
