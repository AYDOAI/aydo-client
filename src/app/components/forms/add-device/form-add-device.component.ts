import {Component} from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../form-base.component';
import {DriverItem, DriversModel} from '../../../models/gateway.model';

@Component({
  selector: 'app-form-add-device',
  templateUrl: './form-add-device.component.html',
  styleUrl: './form-add-device.component.scss'
})
export class FormAddDeviceComponent extends FormBaseComponent {

  override onInit() {
    this.form.title = 'Add device';
    this.form.description = 'This app supports next device types, choose one of them:';

    this.backend.drivers().then((drivers: DriverItem[]) => {
      this.ui.drivers = new DriversModel(drivers);
      drivers.forEach((driver: any) => {
        this.form.inputs.push({
          key: driver.className,
          title: driver.name,
          type: 'button',
          color: 'white',
          backgroundColor: '#060022'
        });
      });
    })

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    this.ui.selectedDriver = this.ui.drivers.items.find(item => item.className === input.key);
    this.ui.step = 'edit-device';
  }

}
