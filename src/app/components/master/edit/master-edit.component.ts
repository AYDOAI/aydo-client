import { Component, inject } from '@angular/core';
import { FormBaseComponent } from "../../form-base.component";
import { ConfirmationModalComponent } from "../../../elements/dialog/confirmation-modal/confirmation-modal.component";
import { DialogService } from "../../../services/dialog.service";
import {ZoneModel} from '../../../models/gateway.model';

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
          defaultValue: setting.value,
          value: setting.value,
          items: setting.items
        })
      });

      this.form.inputs.push({
        key: 'save_device_settings',
        title: 'Save settings',
        type: 'button',
        class: 'btn'
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
      key: 'delete_device',
      title: 'Delete device',
      type: 'button',
      class: 'red-btn'
    });

    this.formGroup = this.createForm(this.form.inputs);
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
        this.router.navigate(['/master']);
      })
    }
  }
}
