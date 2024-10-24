import {Component, Input} from '@angular/core';
import {AppFormInputs} from "../../../shared/types";
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-welcome-sign-in',
  templateUrl: './welcome-sign-in.component.html',
  styleUrl: './welcome-sign-in.component.scss'
})
export class WelcomeSignInComponent extends FormBaseComponent {

  @Input() title = '';

  override onInit() {
    this.form.title = 'Sign in';
    this.form.inputs.push({key: 'login', title: 'E-mail', type: 'input', required: true, email: true, emailSpecialChars: true });
    this.form.inputs.push({key: 'password', title: 'Password', type: 'input', inputType: 'password', required: true, maxLength: 255});
    this.form.inputs.push({key: 'sign_in', title: 'Sign in', type: 'button', color: 'white', backgroundColor: '#060022', displayError: true});

    this.formGroup = this.createForm(this.form.inputs);
  }


  button(input: AppFormInputs) {
    switch (input.key) {
      case 'sign_in':
        const user = {...this.formGroup.value};
        user.login = user.login.trim();
        this.resetFormErrors();
        this.ui.lockBtn(input.key);
        this.backend.userLogin(user).then(() => {
          this.ui.afterLogin();
        }).catch(() => {
        }).finally(() => this.ui.unlockBtn(input.key));
        break;
    }
  }

}
