import { Component } from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../../components/form-base.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent extends FormBaseComponent {

  override onInit() {
    this.form.title = 'Edit profile';
    if (this.ui.user) {
      this.form.inputs.push({
        key: 'firstname',
        title: 'First name',
        type: 'input',
        maxLength: 256,
        required: true,
        onlyLetters: true,
        defaultValue: this.ui.user.firstname,
      });
      this.form.inputs.push({
        key: 'lastname',
        title: 'Last name',
        type: 'input',
        maxLength: 256,
        required: true,
        onlyLetters: true,
        defaultValue: this.ui.user.lastname,
      });
      // this.form.inputs.push({
      //   key: 'wallet',
      //   title: 'Wallet',
      //   type: 'input',
      //   maxLength: 256,
      //   defaultValue: this.ui.user.wallet,
      // });
    }
    this.form.inputs.push({
      key: 'submit',
      title: 'Save',
      type: 'button',
      color: 'white',
      displayError: true,
      backgroundColor: '#060022',
      isDisabled: () => this.formGroup?.invalid
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'submit':
        let values = this.formGroup.value;
        values['wallet'] = '';

        const user = {...values };
        this.ui.lockBtn('submit');
        this.backend.updateUser(user)
          .then(res => this.ui.user = res.user)
          .finally(() => this.ui.unlockBtn('submit'));
        break;
    }
  }
}
