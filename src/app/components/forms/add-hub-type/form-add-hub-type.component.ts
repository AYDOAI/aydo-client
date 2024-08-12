import {Component} from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-form-add-hub-type',
  templateUrl: './form-add-hub-type.component.html',
  styleUrl: './form-add-hub-type.component.scss'
})
export class FormAddHubTypeComponent extends FormBaseComponent {

  override onInit() {
    this.form.title = 'Add hub';
    this.form.description = 'You add AYDO Hub';
    this.form.inputs.push({
      key: 'text',
      title: 'You can search for a hub automatically or add it manually',
      type: 'string',
    });
    this.form.inputs.push({
      key: 'automatically',
      title: 'Add automatically',
      type: 'button',
      icon: 'icon-plus'
    });
    this.form.inputs.push({
      key: 'manually',
      title: 'Add manually',
      type: 'button',
      icon: 'icon-plus'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    this.router.navigate([`${this.router.url}/${input.key}`])
  }

}
