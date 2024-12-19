import {Component} from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-add-zone',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddZoneComponent extends FormBaseComponent {

  override onInit() {
    this.form.title = 'Add zone';
    this.form.description = '';
    this.form.footer = '';

    this.form.inputs.push({
      key: 'name',
      title: 'Name',
      type: 'input',
      required: true
    });

    this.form.inputs.push({
      key: 'is_indoor',
      title: 'Indoor',
      type: 'checkbox'
    });

    this.form.inputs.push({
      key: 'location',
      title: 'Location',
      type: 'google-map'
    });

    this.form.inputs.push({
      key: 'save_zone',
      title: 'Save zone',
      type: 'button',
      color: 'white',
      backgroundColor: '#060022',
      icon: 'arrow-right',
      isDisabled: () => this.formGroup.invalid,
      displayError: true
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    const zone = {
      name: this.formGroup.get('name')?.value,
      location: this.formGroup.get('location')?.value,
      is_indoor: this.formGroup.get('is_indoor')?.value || false,
    };

    this.backend.saveZone(zone).then(() => {
      this.ui.goStep('master');
    })
  }
}
