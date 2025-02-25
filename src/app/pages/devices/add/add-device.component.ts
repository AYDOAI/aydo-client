import { Component } from '@angular/core';
import {
  DevicesModel,
  DriverItem,
  DriversModel,
} from '../../../models/gateway.model';
import { AppFormInputs } from '../../../shared/types';
import { FormBaseComponent } from '../../../components/form-base.component';

@Component({
  selector: 'app-device-add',
  templateUrl: './add-device.component.html',
})
export class AddDeviceComponent extends FormBaseComponent {
  override onInit() {
    this.form.title = 'Add device';
    this.form.description =
      'This app supports next device types, choose one of them:';
    this.form.loading = true;

    this.backend.drivers().subscribe((drivers: DriverItem[]) => {
      this.form.loading = false;
      this.ui.drivers = new DriversModel(drivers);
      drivers.forEach((driver: any) => {
        this.form.inputs.push({
          key: driver.className,
          title: driver.name,
          type: 'button',
          color: 'white',
          backgroundColor: '#060022',
        });
      });
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    this.ui.selectedDriver = this.ui.drivers.items?.find(
      item => item.className === input.key
    );
    const setting = this.ui.selectedDriver?.settings?.items?.find(
      item => item.key === 'pair_mode'
    );
    if (setting) {
      const driver = this.ui.selectedDriver?.parentClassName
        ? this.ui.drivers.items?.find(
            item => item.className === this.ui.selectedDriver?.parentClassName
          )
        : this.ui.selectedDriver;
      if (driver) {
        const device = this.ui.devices?.items?.find(
          item => item.driverId === driver.driverId
        );
        if (device) {
          this.backend
            .deviceCommand({
              command: { ident: device.ident, command: 'pair_mode', value: '' },
            })
            .subscribe(() => {
              this.errors.showInfo(setting.description);
            });
        } else {
          this.backend.getDevices().subscribe((devices: any) => {
            this.ui.devices = new DevicesModel(devices);
            const device = this.ui.devices?.items?.find(
              item => item.driverId === driver.driverId
            );
            if (device) {
              this.backend
                .deviceCommand({
                  command: {
                    ident: device.ident,
                    command: 'pair_mode',
                    value: '',
                  },
                })
                .subscribe(() => {
                  this.errors.showInfo(setting.description);
                });
            } else {
              this.errors.showError('Device not found!');
            }
          });
        }
      } else {
        this.errors.showError('Driver not found!');
      }
    } else {
      this.navCtrl.navigateForward(['/devices/new']);
    }
  }
}
