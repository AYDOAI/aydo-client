import { Component, inject, Input } from '@angular/core';
import { AppFormInputs } from '../../../shared/types';
import { FormBaseComponent } from '../../../components/form-base.component';
import { finalize } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-welcome-sign-in',
  templateUrl: './welcome-sign-in.component.html',
  styleUrl: './welcome-sign-in.component.scss',
})
export class WelcomeSignInComponent extends FormBaseComponent {
  @Input() title = '';
  private readonly userService = inject(UserService);

  override onInit() {
    this.form.inputs.push({
      key: 'login',
      title: 'E-mail',
      type: 'input',
      required: true,
      email: true,
      emailSpecialChars: true,
    });
    this.form.inputs.push({
      key: 'password',
      title: 'Password',
      type: 'input',
      inputType: 'password',
      required: true,
      maxLength: 255,
      latinOnly: true,
    });
    this.form.inputs.push({
      key: 'sign_in',
      title: 'Sign in',
      type: 'button',
      color: 'white',
      backgroundColor: '#060022',
      displayError: true,
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  signIn(input: AppFormInputs) {
    const user = { ...this.formGroup.value };
    user.login = user.login.trim();
    this.resetFormErrors();
    this.ui.lockBtn(input.key);
    this.backend
      .userLogin(user)
      .pipe(finalize(() => this.ui.unlockBtn(input.key)))
      .subscribe(() => {
        this.ui.afterLogin();
      });
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'sign_in': {
        this.signIn(input);
        break;
      }
      default: {
        break;
      }
    }
  }
}
