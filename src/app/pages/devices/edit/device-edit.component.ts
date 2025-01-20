import { Component, inject } from '@angular/core';
import { FormBaseComponent } from "../../../components/form-base.component";
import { ConfirmationModalComponent } from "../../../elements/dialog/confirmation-modal/confirmation-modal.component";
import { DialogService } from "../../../services/dialog.service";
import {DeviceItem, ZoneModel} from '../../../models/gateway.model';
import { AppFormInputs } from "../../../shared/types";
import { IDeviceSettings } from "../../../shared/interfaces/device-settings.interface";


@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrl: './device-edit.component.scss'
})
export class DeviceEditComponent extends FormBaseComponent {

  private dialog = inject(DialogService)

  public override ngOnInit() {
    super.ngOnInit();
    if (!this.ui.selectedDevice) {
      this.navCtrl.navigateBack(['/devices']);
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

      this.ui.selectedDriver = this.ui.drivers.items?.find(item => item.driverId === this.ui.selectedDevice!.driverId);
      this.ui.selectedDevice?.settings?.forEach((setting) => {
        const driverSetting = this.ui.selectedDriver?.settings?.items?.find(s => s.key === setting.key)
        this.form.inputs.push({
          required: setting.required,
          key: setting.key,
          title: setting.name,
          type: driverSetting?.type || setting.type,
          defaultValue: this.getDefaultValue(setting),
          value: setting.value,
          items: this.getItems(setting),
          conditions: this.getConditions(setting)
        })
      });
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

  public getItems(setting: any) {
    if (setting.items) {
      return setting.items;
    }

    const driverSetting = this.ui.selectedDriver?.settings?.items.find(item => item.key == setting.key);
    if (driverSetting?.items) {
      return driverSetting?.items;
    }

    return [];
  }

  public getConditions(setting: any) {
    if (setting.conditions) {
      return setting.conditions;
    }

    const driverSetting = this.ui.selectedDriver?.settings?.items.find(item => item.key == setting.key);
    if (driverSetting?.conditions) {
      return driverSetting?.conditions;
    }

    return null;
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
    const obj: IDeviceSettings = Object.keys(this.formGroup.controls).reduce((acc, key) => {
      const value = this.formGroup.get(key)?.value;

      if (key === 'device_name') {
        acc.device_name = (value || '').trim();
      } else if (key === 'zoneId') {
        acc.zone_id = value ? Number(value) : 0;
      } else if (value !== undefined && value !== null) {
        const initialSetting = this.ui.selectedDevice?.settings?.find(s => s.key === key);
        if (initialSetting && String(value) !== String(initialSetting.value)) {
          acc.settings![key] = String(value);
        }
      }
      return acc;
    }, {
      device_ident: this.ui.selectedDevice?.ident!,
      device_name: '',
      zone_id: 0,
      settings: {}
    } as IDeviceSettings);

    this.ui.lockBtn('save_device_settings');
    this.backend.updateDevice(obj).then(() => {
      this.ui.devices.items = this.ui.devices.items
        .map((item) => item.ident === obj.device_ident ? { ...item, name: obj.device_name, zoneId: obj.zone_id } : item)
      this.errors.showInfo('Device settings saved!');
    }).finally(() => {
      this.ui.unlockBtn('save_device_settings');
    })
  }

  public deleteDevice(): void {
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
        this.navCtrl.navigateForward(['/devices']);
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

    const selectedDeviceSetting = this.ui.selectedDevice?.settings?.find(s => s.key === property);

    if (selectedDeviceSetting) {
      return selectedDeviceSetting.value;
    }

    if (setting.value) {
      return setting.value;
    }

    return '';
  }
}
