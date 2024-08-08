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
        // @ts-ignore
        this.backend.saveDevice(device).then(() => {
          this.ui.goStep('devices');
        })
        break;
    }
  }

}
