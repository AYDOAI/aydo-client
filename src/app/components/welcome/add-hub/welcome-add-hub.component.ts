import { Component } from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppForm, AppFormInputs} from '../../../shared/types';

@Component({
  selector: 'app-welcome-add-hub',
  templateUrl: './welcome-add-hub.component.html',
  styleUrl: './welcome-add-hub.component.scss'
})
export class WelcomeAddHubComponent extends WelcomeBaseComponent {


  override onInit() {
    this.form.title = 'Add hub';
    this.form.description = 'This app supports next hubs, choose one of them:';
    this.form.footer = '<p>Zigbee module required for Raspberry Pi and other hubs</p><p>Please ensure that the device is connected to your network and is functioning properly.</p>';
    this.form.inputs.push({key: '', title: 'AYDO Hub', type: 'button', color: 'white', backgroundColor: '#060022'});
    this.form.inputs.push({key: '', title: 'Raspberry Pi', type: 'button', color: 'white', backgroundColor: '#060022'});
    this.form.inputs.push({key: '', title: 'Other hub', type: 'button', color: 'white', backgroundColor: '#060022'});

    this.formGroup = this.createForm(this.form.inputs);
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'send_link':
        const user = {...this.formGroup.value};
        this.resetFormErrors();
        // this.backend.forgot(user).then((data: any) => {
        //   console.log(data)
        // }).catch(() => {
        // });
        break;
    }
  }

}
