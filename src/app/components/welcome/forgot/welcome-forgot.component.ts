import {Component} from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-welcome-forgot',
  templateUrl: './welcome-forgot.component.html',
  styleUrl: './welcome-forgot.component.scss'
})
export class WelcomeForgotComponent extends FormBaseComponent {

  override onInit() {
    this.form.title = 'Forgot password?';
    this.form.inputs.push({key: 'login', title: 'E-mail', type: 'input', required: true, email: true, emailSpecialChars: true});
    this.form.inputs.push({key: 'send_link', title: 'Send recovery link', type: 'button', color: 'white', backgroundColor: '#060022'});

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'send_link':
        this.ui.lockBtn('send_link');
        const user = {...this.formGroup.value};
        this.resetFormErrors();
        this.backend.userForgot(user).then((data: any) => {
          console.log(data)
        }).catch(() => {
        }).finally(() => this.ui.unlockBtn('send_link'));
        break;
    }
  }

}
