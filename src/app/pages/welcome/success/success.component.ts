import {Component} from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../../components/form-base.component';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent extends FormBaseComponent {

  public linkSent: boolean = false;

  override onInit() {
    this.form.title = 'Sign up';
    this.form.inputs.push({key: 'success_message',
      type: 'string', title: 'You have successfully registered. Please check your email to confirm your account.'})
    this.form.inputs.push({key: 'resend', type: 'button', title: 'Resend confirmation email', isDisabled: () => this.formGroup?.invalid})
    this.form.inputs.push({key: 'logout', type: 'button', title: 'Logout'})
    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'resend':
        this.ui.lockBtn('resend');
        this.backend.resendCode().then((data: any) => {
          this.linkSent = true;
        }).catch(() => {
        }).finally(() => this.ui.unlockBtn('resend'));
        break;
      case 'logout':
        this.ui.logout();
        break;
    }
  }

}
