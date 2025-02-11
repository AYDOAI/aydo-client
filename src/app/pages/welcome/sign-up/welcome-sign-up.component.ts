import { Component, inject } from '@angular/core';
import { AppFormInputs } from '../../../shared/types';
import { FormBaseComponent } from '../../../components/form-base.component';
import { environment } from '../../../../environments/environment';
import { finalize } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-welcome-sign-up',
  templateUrl: './welcome-sign-up.component.html',
  styleUrl: './welcome-sign-up.component.scss',
})
export class WelcomeSignUpComponent extends FormBaseComponent {
  private readonly userService = inject(UserService);
  override onInit() {
    this.form.inputs.push({
      key: 'firstname',
      title: 'First name',
      type: 'input',
      maxLength: 256,
      required: true,
      onlyLetters: true,
    });
    this.form.inputs.push({
      key: 'lastname',
      title: 'Last name',
      type: 'input',
      maxLength: 256,
      required: true,
      onlyLetters: true,
    });
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
      strongPassword: true,
      latinOnly: true,
    });
    this.form.inputs.push({
      key: 'password_confirmation',
      title: 'Password confirmation',
      type: 'input',
      inputType: 'password',
      required: true,
      matchingKey: 'password',
    });
    this.form.inputs.push({
      key: 'invite_code',
      title: 'Invite code',
      type: 'input',
      defaultValue: this.ui?.inviteId || '',
    });
    this.form.inputs.push({
      key: 'agreement',
      title: '',
      type: 'agreement',
      defaultValue: false,
      requiredTrue: true,
    });
    if (environment.recaptcha.enabled) {
      this.form.inputs.push({
        key: 'recaptcha',
        title: '',
        type: 'recaptcha',
        required: true,
      });
    }
    this.form.inputs.push({
      key: 'sign_up',
      title: 'Sign up',
      type: 'button',
      color: 'white',
      backgroundColor: '#060022',
      displayError: true,
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'sign_up':
        if (this.formGroup.valid) {
          const user = { ...this.formGroup.value };
          user.email = user.login.trim();
          user.inviteId = this.formGroup.get('invite_code')?.value;
          this.resetFormErrors();
          this.ui.lockBtn('sign_up');
          this.backend
            .userRegister(user)
            .pipe(finalize(() => this.ui.unlockBtn('sign_up')))
            .subscribe(data => {
              this.storage.token = data.token;
              this.storage.refreshToken = data.refresh_token;
              this.ui.afterLogin();
              this.userService.reloadUser();
            });
          break;
        }
    }
  }
}
