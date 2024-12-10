import {Component} from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-form-edit-device',
  templateUrl: './form-edit-device.component.html',
  styleUrl: './form-edit-device.component.scss'
})
export class FormEditDeviceComponent extends FormBaseComponent {
  override onInit() {
    this.form.title = 'Edit device';
    // this.form.description = 'This app supports next device types, choose one of them:';
    this.form.inputs.push({
      key: 'name',
      title: 'Device name',
      type: 'input',
      defaultValue: this.ui.selectedDriver?.name,
      color: 'white',
      backgroundColor: '#060022'
    });
    this.ui.selectedDriver?.settings?.items.forEach(setting => {
      if (setting.type === 'input') {
        this.form.inputs.push({
          key: setting.key,
          title: setting.name,
          type: setting.type,
          defaultValue: setting.defaultValue,
          color: 'white',
          backgroundColor: '#060022'
        });
      }

      if (setting.type === 'google-map') {
        this.form.inputs.push({
          key: setting.key,
          title: setting.name,
          type: setting.type,
          defaultValue: setting.defaultValue,
          color: 'white',
          backgroundColor: '#060022'
        });
      }

      if (setting.type === 'select') {
        this.form.inputs.push({
          key: setting.key,
          title: setting.name,
          type: setting.type,
          defaultValue: setting.defaultValue,
          items: setting.items,
          color: 'white',
          backgroundColor: '#060022'
        });
      }
    });
    this.form.inputs.push({
      key: 'save_device',
      title: 'Save device',
      type: 'button',
      color: 'white',
      backgroundColor: '#060022'
    });
    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'save_device':
        this.resetFormErrors();
        const device = {
          name: this.formGroup.get('name')?.value,
          class_name: this.ui.selectedDriver?.className,
          ident: `${this.ui.selectedDriver?.className}_${new Date().getTime()}`,
          settings: {...this.formGroup.value}
        };

        const isValid = this.isDeviceValid();

        if (isValid) {
          // @ts-ignore
          this.backend.saveDevice(device).then(() => {
            this.ui.goStep('devices');
          })
        } else {
          this.errors.showError('Device with such settings is already linked to your account')
        }
        break;
    }
  }

  private isDeviceValid(): boolean {
    const currDevicesByDriverId = this.ui.devices?.items?.filter(device => device.driverId === this.ui.selectedDriver?.driverId);

    if (currDevicesByDriverId) {
      for (const device of currDevicesByDriverId) {
        if (device.settings && device.settings.length > 0) {
          const uniqueSettings = device.settings.filter(setting => setting.unique);
          if (uniqueSettings.length > 0) {
            const allMatch = uniqueSettings.every(us => us.value === this.formGroup.value[us.key]);
            if (allMatch) {
              return false
            }
          }
        }
      }
    }

    return true;
  }

}
