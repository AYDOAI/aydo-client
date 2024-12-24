import { Component, inject } from '@angular/core';
import { FormBaseComponent } from "../../form-base.component";
import { ConfirmationModalComponent } from "../../../elements/dialog/confirmation-modal/confirmation-modal.component";
import { DialogService } from "../../../services/dialog.service";
import {DeviceItem, ZoneModel} from '../../../models/gateway.model';
import { AppFormInputs } from "../../../shared/types";
import { IDeviceSettings } from "../../../shared/interfaces/device-settings.interface";


@Component({
  selector: 'app-master-edit',
  templateUrl: './master-edit.component.html',
  styleUrl: './master-edit.component.scss'
})
export class MasterEditComponent extends FormBaseComponent {

  private dialog = inject(DialogService)

  public override ngOnInit() {
    super.ngOnInit();
    if (!this.ui.selectedDevice) {
      this.router.navigate(['/master']);
    }

    this.form.title = this.ui.selectedDevice?.name || '';

    this.form.inputs.push({
      key: 'device_name',
      title: 'Device name',
      type: 'input',
      defaultValue: this.ui.selectedDevice?.name || '',
      required: true,
      minLength: 1,
      maxLength: 30,
      latinOnly: true,
      onlySpaces: true,
      specialCharacters: true
    })

    if (this.ui.selectedDevice?.settings?.length) {
      this.form.inputs.push({
        key: '',
        title: 'Device settings',
        type: 'string',
        class: 'group-label'
      });
      this.ui.selectedDevice?.settings?.forEach((setting) => {
        this.form.inputs.push({
          key: setting.key,
          title: setting.name,
          type: setting.type,
          defaultValue: this.getDefaultValue(setting),
          value: setting.value,
          items: setting.items
        })
      });
    }

    if (this.ui.selectedDevice?.capabilities?.length) {
      this.form.inputs.push({
        key: '',
        title: 'Device capabilities',
        type: 'string',
        class: 'group-label'
      });
      this.ui.selectedDevice?.capabilities?.forEach((capability) => {
        this.form.inputs.push({
          key: capability.ident,
          title: '',
          type: 'text',
          defaultValue: capability.displayName,
          value: capability.displayName
        })
      })
    }

    this.form.inputs.push({
      key: 'save_device_settings',
      title: 'Save settings',
      type: 'button',
      class: 'btn',
      displayError: true
    });

    this.form.inputs.push({
      key: 'delete_device',
      title: 'Delete device',
      type: 'button',
      class: 'red-btn'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  public button(button: AppFormInputs): void {
    switch (button.key) {
      case 'delete_device':
        this.deleteDevice();
        return;
      case 'save_device_settings':
        this.updateDevice();
        return;
      default:
        return;
    }
  }

  private updateDevice(): void {
    const obj: IDeviceSettings = {
      device_ident: this.ui.selectedDevice?.ident!,
      device_name: (this.formGroup.get('device_name')?.value || '').trim(),
      zone_id: this.formGroup.get('zoneId')?.value || null
    };
    this.ui.lockBtn('save_device_settings');
    this.backend.updateDevice(obj).then(() => {
      this.ui.devices.items = this.ui.devices.items
        .map((item) => item.ident === obj.device_ident ? { ...item, name: obj.device_name } : item)
      this.errors.showInfo('Device settings saved!');
    }).finally(() => {
      this.ui.unlockBtn('save_device_settings');
    })
  }

  private deleteDevice(): void {
    this.dialog.show(ConfirmationModalComponent, {
      title: 'Confirmation',
      description: 'Are you sure you want to delete this device?',
      confirm: () => this.delete()
    })
  }

  private delete(): void {
    const device = this.ui.selectedDevice;
    if (device?.ident) {
      this.backend.deleteDevice(device.ident).then(res => {
        this.ui.devices.items = this.ui.devices.items.filter(d => d.ident !== device.ident);
        this.router.navigate(['/master']);
      })
    }
  }

  private getDefaultValue(setting: any) {
    const property: keyof DeviceItem = setting.key;

    if (
      this.ui.selectedDevice &&
      this.ui.selectedDevice[property]
    ) {
      return this.ui.selectedDevice[property];
    }

    if (setting.value) {
      return setting.value;
    }

    return '';
  }
}
