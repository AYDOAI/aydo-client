import { Component, inject, OnInit } from '@angular/core';
import { FormBaseComponent } from '../../../components/form-base.component';
import { DeviceItem } from '../../../models/gateway.model';
import { AppFormInputs } from '../../../shared/types';
import { IDeviceSettings } from '../../../shared/interfaces/device-settings.interface';
import { finalize, firstValueFrom } from 'rxjs';
import { DevicesService } from '../../../services/devices.service';
import { DataStream, StreamService } from '../../../services/stream.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrl: './device-edit.component.scss',
})
export class DeviceEditComponent extends FormBaseComponent implements OnInit {
  private deviceService = inject(DevicesService);
  private streamService = inject(StreamService);
  private modalService = inject(ModalService);
  selectedDevice$ = this.deviceService.selectedDevice$;

  public override ngOnInit() {
    super.ngOnInit();
    const selectedDevice = this.deviceService.getSelectedDevice();
    if (!selectedDevice) {
      this.navCtrl.navigateBack('/devices');
      return;
    }

    this.form.inputs.push({
      key: 'device_name',
      title: 'Device name',
      type: 'input',
      defaultValue: selectedDevice.name,
      required: true,
      minLength: 1,
      maxLength: 30,
      latinOnly: true,
      onlySpaces: true,
      specialCharacters: true,
    });

    if (selectedDevice.settings?.length) {
      this.form.inputs.push({
        key: '',
        title: 'Device settings',
        type: 'string',
        class: 'group-label',
      });

      this.ui.selectedDriver = this.ui.drivers.items?.find(
        item => item.driverId === selectedDevice.driverId
      );
      selectedDevice.settings?.forEach(setting => {
        const driverSetting = this.ui.selectedDriver?.settings?.items?.find(
          s => s.key === setting.key
        );
        this.form.inputs.push({
          required: setting.required,
          key: setting.key,
          title: setting.name,
          type: driverSetting?.type || setting.type,
          defaultValue: this.getDefaultValue(setting),
          value: setting.value,
          items: this.getItems(setting),
          conditions: this.getConditions(setting),
        });
      });
    }

    this.form.inputs.push({
      key: 'save_device_settings',
      title: 'Save settings',
      type: 'button',
      class: 'btn',
      displayError: true,
    });

    this.form.inputs.push({
      key: 'delete_device',
      title: 'Delete device',
      type: 'button',
      class: 'red-btn',
    });

    this.formGroup = this.createForm(this.form.inputs);

    this.selectedDevice$.subscribe(device => {
      if (device) {
        this.form.title = device.name;
        this.formGroup.patchValue(device);
      }
    });
  }

  public getItems(setting: any) {
    if (setting.items) {
      return setting.items;
    }

    const driverSetting = this.ui.selectedDriver?.settings?.items.find(
      item => item.key == setting.key
    );
    if (driverSetting?.items) {
      return driverSetting?.items;
    }

    return [];
  }

  public getConditions(setting: any) {
    if (setting.conditions) {
      return setting.conditions;
    }

    const driverSetting = this.ui.selectedDriver?.settings?.items.find(
      item => item.key == setting.key
    );
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
    const selectedDevice = this.deviceService.getSelectedDevice();

    const obj: IDeviceSettings = Object.keys(this.formGroup.controls).reduce(
      (acc, key) => {
        const value = this.formGroup.get(key)?.value;

        if (key === 'device_name') {
          acc.device_name = (value || '').trim();
        } else if ((key === 'zoneId' || key.includes('zone')) && value) {
          acc.zone_id = Number(value);
        } else if (value !== undefined && value !== null) {
          const initialSetting = selectedDevice?.settings?.find(
            s => s.key === key
          );
          if (
            initialSetting &&
            String(value) !== String(initialSetting.value)
          ) {
            acc.settings![key] = String(value);
          }
        }
        return acc;
      },
      {
        device_ident: selectedDevice?.ident!,
        device_name: '',
        settings: {},
      } as IDeviceSettings
    );

    this.ui.lockBtn('save_device_settings');
    this.deviceService
      .updateItem(obj)
      .pipe(finalize(() => this.ui.unlockBtn('save_device_settings')))
      .subscribe(() => {
        this.ui.devices.items = this.ui.devices.items.map(item =>
          item.ident === obj.device_ident
            ? { ...item, name: obj.device_name, zoneId: obj.zone_id }
            : item
        );
        this.errors.showInfo('Device settings saved!');
      });
  }

  public async deleteDevice(): Promise<void> {
    const selectedDevice = this.deviceService.getSelectedDevice();
    if (!selectedDevice) {
      return;
    }
    const deviceDriver = this.ui.drivers?.items?.find(
      driver => driver.driverId === selectedDevice.driverId
    );
    if (deviceDriver) {
      const driverClassName = deviceDriver.className;
      const streams = await firstValueFrom(this.streamService.streams$);
      const isDeviceRequired = streams.find(
        (s: DataStream) =>
          s.status === 1 &&
          s.requiredPluginClassName &&
          s.requiredPluginClassName!.includes(driverClassName!)
      );
      if (isDeviceRequired) {
        this.modalService.showAlert({
          header: `This device is currently used in the project "${isDeviceRequired.name}"`,
          message:
            'To delete this device, please stop the associated project first.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'View Projects',
              handler: () => {
                this.modalService.dismissModal();
                this.navCtrl.navigateForward('/streams');
              },
            },
          ],
        });
        return;
      }
    }
    this.modalService.showAlert({
      header: `Confirmation`,
      message: 'Are you sure you want to delete this device?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.delete();
          },
        },
      ],
    });
  }

  private delete(): void {
    const selectedDevice = this.deviceService.getSelectedDevice();
    if (selectedDevice) {
      this.backend.deleteDevice(selectedDevice.ident).subscribe(res => {
        this.ui.devices.items = this.ui.devices.items.filter(
          d => d.ident !== selectedDevice.ident
        );
        this.navCtrl.navigateForward('/devices');
      });
    }
  }

  private getDefaultValue(setting: any) {
    const selectedDevice = this.deviceService.getSelectedDevice();
    const property: keyof DeviceItem = setting.key;

    if (selectedDevice && selectedDevice[property]) {
      return selectedDevice[property];
    }

    const selectedDeviceSetting = selectedDevice?.settings?.find(
      s => s.key === property
    );

    if (selectedDeviceSetting) {
      return selectedDeviceSetting.value;
    }

    if (setting.value) {
      return setting.value;
    }

    return '';
  }
}
