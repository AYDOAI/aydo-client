import { Component } from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppFormInputs} from '../../../shared/types';

@Component({
  selector: 'app-welcome-add-hub',
  templateUrl: './welcome-add-hub.component.html',
  styleUrl: './welcome-add-hub.component.scss'
})
export class WelcomeAddHubComponent extends WelcomeBaseComponent {

  override onInit() {
    this.form.title = 'Add hub';
    this.form.description = 'This app supports next hubs, choose one of them:';
    this.form.footer = '<p>Zigbee module required for Raspberry Pi and other hubs</p>';
    // <p>Please ensure that the device is connected to your network and is functioning properly.</p>
    this.form.inputs.push({key: 'hub_aydo', title: 'AYDO Hub', type: 'button', color: 'white', backgroundColor: '#3E3C49'});
    this.form.inputs.push({key: 'hub_pi', title: 'Raspberry Pi', type: 'button', color: 'white', backgroundColor: '#060022'});
    this.form.inputs.push({key: 'hub_other', title: 'Other hub', type: 'button', color: 'white', backgroundColor: '#060022'});

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'hub_aydo':
        this.errors.showError('This hub will be implemented later');
        break;
      case 'hub_pi':
      case 'hub_other':
        this.service.selectedHubType = input.key;
        this.service.step = 'config-hub';
        break;
    }
  }

}
