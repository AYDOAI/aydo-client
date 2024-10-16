import { Component } from '@angular/core';
import {AppFormInputs} from '../../shared/types';
import {FormBaseComponent} from '../form-base.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends FormBaseComponent {

  override onInit() {
    this.form.title = 'Profile';
    if (this.ui.user) {

      this.form.inputs.push({
        key: 'firstname',
        title: 'First name',
        type: 'text',
        defaultValue: this.ui.user.firstname,
      });
      this.form.inputs.push({
        key: 'lastname',
        title: 'Last name',
        type: 'text',
        defaultValue: this.ui.user.lastname,
      });
      this.form.inputs.push({
        key: 'login',
        title: 'Login',
        type: 'text',
        defaultValue: this.ui.user.login,
      });
      this.form.inputs.push({
        key: 'balance',
        title: 'Balance',
        type: 'text',
        defaultValue: this.ui.user.balance,
      });
    }
    this.form.inputs.push({
      key: 'logout',
      title: 'Logout',
      type: 'button',
      color: 'white',
      backgroundColor: '#060022'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'logout':
        this.resetFormErrors();
        this.ui.logout();
        break;
    }
  }
}
