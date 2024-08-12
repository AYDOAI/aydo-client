import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {BackendService} from '../../services/backend.service';
import {ErrorsService} from '../../services/errors.service';
import {StorageService} from '../../services/storage.service';
import {FormBuilder} from '@angular/forms';
import {UIService} from '../../services/ui.service';
import {BaseComponent} from '../base.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent extends BaseComponent {

  error: any[] = [];
  showErrorSub: Subscription;

  constructor(public override ui: UIService,
              public override backend: BackendService,
              public override errors: ErrorsService,
              public override storage: StorageService,
              public override router: Router,
              public override fb: FormBuilder) {
    super(ui, backend, errors, storage, router, fb);
    this.showErrorSub = this.errors.showErrorSub().subscribe((data: any) => {
      this.error.push(data);
    });
  }

  closeError() {
    this.error.splice(0, 1);
  }

}
