import {Component, Input} from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppFormInputs} from "../../../shared/types";

@Component({
  selector: 'app-welcome-sign-in',
  templateUrl: './welcome-sign-in.component.html',
  styleUrl: './welcome-sign-in.component.scss'
})
export class WelcomeSignInComponent extends WelcomeBaseComponent {

  @Input() title = '';

  override onInit() {
    this.form.title = 'Sign in';
    this.form.inputs.push({key: 'login', title: 'E-mail', type: 'input'});
    this.form.inputs.push({key: 'password', title: 'Password', type: 'input', inputType: 'password'});
    this.form.inputs.push({key: 'sign_in', title: 'Sign in', type: 'button', color: 'white', backgroundColor: '#060022'});

    this.formGroup = this.createForm(this.form.inputs);
  }


  button(input: AppFormInputs) {
    switch (input.key) {
      case 'sign_in':
        const user = {...this.formGroup.value};
        this.resetFormErrors();
        this.backend.login(user).then((data: any) => {
          this.storage.set('token', data.user.token);
          this.storage.set('refresh_token', data.user.refresh_token);
          this.service.step = 'add-hub';
        }).catch(() => {
        });
        break;
    }
  }

}