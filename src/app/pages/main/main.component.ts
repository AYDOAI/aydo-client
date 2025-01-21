import {Component} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {ErrorsService} from '../../services/errors.service';
import {StorageService} from '../../services/storage.service';
import {FormBuilder} from '@angular/forms';
import {UIService} from '../../services/ui.service';
import {BaseComponent} from '../../components/base.component';
import {Router} from '@angular/router';
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent extends BaseComponent {

  constructor(public override ui: UIService,
              public override backend: BackendService,
              public override errors: ErrorsService,
              public override storage: StorageService,
              public override router: Router,
              public override fb: FormBuilder,
              public override navCtrl: NavController) {
    super(ui, backend, errors, storage, router, fb, navCtrl);
  }

}
