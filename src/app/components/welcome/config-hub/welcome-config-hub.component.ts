import {Component} from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppFormInputs} from '../../../shared/types';

@Component({
  selector: 'app-welcome-config-hub',
  templateUrl: './welcome-config-hub.component.html',
  styleUrl: './welcome-config-hub.component.scss'
})
export class WelcomeConfigHubComponent extends WelcomeBaseComponent {

  override onInit() {
    this.form.title = 'Configure hub';
    this.form.inputs.push({key: 'identifier', title: 'Hub identifier', type: 'input'});
    this.form.inputs.push({key: 'token', title: 'Hub token', type: 'input'});
    this.form.inputs.push({
      key: 'attach',
      title: 'Connect hub to your account',
      type: 'button',
      color: 'white',
      backgroundColor: '#060022'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'attach':
        const gateway = {...this.formGroup.value};
        this.resetFormErrors();
        this.backend.gatewayConnect(gateway).then((data: any) => {
          if (data && data.gateway && data.gateway.identifier) {
            this.storage.set('server_id', data.gateway.identifier);
          }
        }).catch(() => {

        });
    }
  }

}
