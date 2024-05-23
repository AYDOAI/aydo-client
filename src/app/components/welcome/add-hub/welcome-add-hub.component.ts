import { Component } from '@angular/core';
import {WelcomeBaseComponent} from '../welcome-base.component';
import {AppForm} from '../../../shared/types';

@Component({
  selector: 'app-welcome-add-hub',
  templateUrl: './welcome-add-hub.component.html',
  styleUrl: './welcome-add-hub.component.scss'
})
export class WelcomeAddHubComponent extends WelcomeBaseComponent {

  form: AppForm = {
    title: 'Add hub',
    description: 'This app supports next hubs, choose one of them:',
    footer: '<p>Zigbee module required for Raspberry Pi and other hubs</p><p>Please ensure that the device is connected to your network and is functioning properly.</p>',
    // @ts-ignore
    inputs: [
      {title: 'AYDO Hub', type: 'button', color: 'white', backgroundColor: '#060022'},
      {title: 'Raspberry Pi', type: 'button', color: 'white', backgroundColor: '#060022'},
      {title: 'Other hub', type: 'button', color: 'white', backgroundColor: '#060022'},
    ]
  };

}
