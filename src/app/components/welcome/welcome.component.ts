import {Component} from '@angular/core';
import {WelcomeBaseComponent} from './welcome-base.component';
import {Subscription} from 'rxjs';
import {WelcomeService} from '../../services/welcome.service';
import {BackendService} from '../../services/backend.service';
import {ErrorsService} from '../../services/errors.service';
import {StorageService} from '../../services/storage.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent extends WelcomeBaseComponent {

  error: any[] = [];
  showErrorSub: Subscription;

  constructor(public override service: WelcomeService,
              public override backend: BackendService,
              public override errors: ErrorsService,
              public override storage: StorageService,
              public override fb: FormBuilder) {
    super(service, backend, errors, storage, fb);
    this.showErrorSub = this.errors.showErrorSub().subscribe((message: any) => {
      this.error.push(message);
    });
  }

  closeError() {
    this.error.splice(0, 1);
  }

}
