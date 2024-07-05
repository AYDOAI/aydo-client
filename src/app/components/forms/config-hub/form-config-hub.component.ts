import {Component} from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-form-config-hub',
  templateUrl: './form-config-hub.component.html',
  styleUrl: './form-config-hub.component.scss'
})
export class FormConfigHubComponent extends FormBaseComponent {

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
            this.storage.serverId = data.gateway.identifier;
            this.ui.step = 'dashboard';
          }
        }).catch(() => {

        });
    }
  }

}
