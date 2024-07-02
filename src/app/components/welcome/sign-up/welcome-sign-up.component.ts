import {Component} from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppFormInputs} from '../../../shared/types';

@Component({
  selector: 'app-welcome-sign-up',
  templateUrl: './welcome-sign-up.component.html',
  styleUrl: './welcome-sign-up.component.scss'
})
export class WelcomeSignUpComponent extends WelcomeBaseComponent {

  override onInit() {
    this.form.title = 'Sign up';
    this.form.inputs.push({key: 'firstname', title: 'First name', type: 'input'})
    this.form.inputs.push({key: 'lastname', title: 'Last name', type: 'input'})
    this.form.inputs.push({key: 'login', title: 'E-mail', type: 'input'})
    this.form.inputs.push({key: 'password', title: 'Password', type: 'input', inputType: 'password'})
    this.form.inputs.push({key: 'password_confirmation', title: 'Password confirmation', type: 'input', inputType: 'password'})
    this.form.inputs.push({key: 'sign_up', title: 'Sign up', type: 'button', color: 'white', backgroundColor: '#060022'})

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'sign_up':
        const user = {...this.formGroup.value};
        user.email = user.login;
        this.resetFormErrors();
        this.backend.userRegister(user).then(() => {
          this.service.step = 'sign-in';
        }).catch(() => {
        });
        break;
    }
  }

}
