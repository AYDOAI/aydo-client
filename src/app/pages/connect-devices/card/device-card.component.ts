import { Component } from '@angular/core';
import { FormBaseComponent } from "../../../components/form-base.component";

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrl: './device-card.component.scss'
})
export class DeviceCardComponent extends FormBaseComponent {
  override onInit() {
    this.form.inputs.push({key: 'Name', title: 'Name', type: 'input', defaultValue: 'Street Camera' });
    this.form.inputs.push({key: 'Location', title: 'Location', type: 'input', defaultValue: 'Moscow'});
    this.form.inputs.push({key: 'Status', title: 'Status', type: 'input', defaultValue: 'Live'});

    this.formGroup = this.createForm(this.form.inputs);
  }
}
