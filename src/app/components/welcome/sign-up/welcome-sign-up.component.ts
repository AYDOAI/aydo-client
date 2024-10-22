import {Component} from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-welcome-sign-up',
  templateUrl: './welcome-sign-up.component.html',
  styleUrl: './welcome-sign-up.component.scss'
})
export class WelcomeSignUpComponent extends FormBaseComponent {

  override onInit() {
    this.form.title = 'Sign up';
    this.form.inputs.push({key: 'firstname', title: 'First name', type: 'input', maxLength: 256, required: true, onlyLetters: true})
    this.form.inputs.push({key: 'lastname', title: 'Last name', type: 'input', maxLength: 256, required: true, onlyLetters: true})
    this.form.inputs.push({key: 'login', title: 'E-mail', type: 'input', required: true, email: true, emailSpecialChars: true})
    this.form.inputs.push({key: 'password', title: 'Password', type: 'input', inputType: 'password', required: true, maxLength: 255})
    this.form.inputs.push({key: 'password_confirmation', title: 'Password confirmation', type: 'input', inputType: 'password', required: true, matchingKey: 'password'})
    this.form.inputs.push({key: 'sign_up', title: 'Sign up', type: 'button', color: 'white', backgroundColor: '#060022', displayError: true})
    this.form.inputs.push({key: 'agreement', title: '', type: 'agreement', defaultValue: false, requiredTrue: true})

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'sign_up':
        if (this.formGroup.valid) {
          const user = { ...this.formGroup.value };
          user.email = user.login.trim();
          this.resetFormErrors();
          this.backend.userRegister(user).then(() => {
            this.ui.goStep('sign-in');
          }).catch(() => {
          });
          break;
        }
    }
  }

}
