import {Component, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";

import {UIService} from "../../services/ui.service";
import {BackendService} from "../../services/backend.service";
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-demo',
  template: '',
  styles: []
})
export class DemoComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
    private ui: UIService,
    private backend: BackendService) {}

    ngOnInit(): void {
      this.backend.userLogin({login: 'test@aydo.ai', password: '1qaz@WSX'}).then(() => {
        this.ui.afterLogin();
      })
      this.navCtrl.navigateForward([environment.index_url]);
    }
}
