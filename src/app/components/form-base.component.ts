import {Component} from '@angular/core';
import {AppForm, FrameStep} from '../shared/types';
import {BaseComponent} from './base.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BackendService} from '../services/backend.service';
import {ErrorsService} from "../services/errors.service";
import {StorageService} from "../services/storage.service";
import {UIService} from '../services/ui.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-form-base',
  template: '',
})
export class FormBaseComponent extends BaseComponent {

  form: AppForm = {title: '', inputs: []};
  formGroup!: FormGroup;

  constructor(public override ui: UIService,
              public override backend: BackendService,
              public override errors: ErrorsService,
              public override storage: StorageService,
              public override router: Router,
              public override fb: FormBuilder) {
    super(ui, backend, errors, storage, router, fb);
  }

  select(event: FrameStep) {
    switch (event) {
      case 'demo':
        this.backend.userLogin({login: 'test@aydo.ai', password: '1qaz@WSX'}).then(() => {
          this.ui.afterLogin();
        })
        break;
      default:
        this.ui.goStep(event);
        break;
    }
  }

  override onError(message: any) {
    let exists = false;
    if (message && message.codes && message.errors) {
      message.codes.forEach((code: string, index: number) => {
        const input = this.form.inputs.find(item => item.key === code);
        if (input) {
          input.error = message.errors[index];
          exists = true;
        }
      })
    }
    if (!exists) {
      this.errors.showError(message.message);
    }
  }

  resetFormErrors() {
    this.form.inputs.forEach(input => {
      input.error = '';
    })
  }

}
