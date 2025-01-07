import {Component} from '@angular/core';
import { BaseComponent } from "../../components/base.component";
import { DeviceItem } from "../../models/gateway.model";

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent extends BaseComponent {
  public edit(device: DeviceItem): void {
    this.ui.selectedDevice = device;
    this.router.navigate(['/master/edit'])
  }
}
