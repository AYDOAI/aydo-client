import {Component} from '@angular/core';
import {WelcomeService} from '../../services/welcome.service';
import {AppForm, WelcomeStep} from '../../shared/types';
import {BaseComponent} from '../base.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BackendService} from '../../services/backend.service';
import {ErrorsService} from "../../services/errors.service";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-welcome-base',
  template: '',
})
export class WelcomeBaseComponent extends BaseComponent {

  form: AppForm = {title: '', inputs: []};
  formGroup!: FormGroup;

  constructor(public service: WelcomeService,
              public override backend: BackendService,
              public override errors: ErrorsService,
              public override storage: StorageService,
              public override fb: FormBuilder) {
    super(backend, errors, storage, fb);
  }

  select(event: WelcomeStep) {
    switch (event) {
      case 'demo':
        console.log('not implemented yet');
        break;
      default:
        this.service.step = event;
        break;
    }
  }

  override onError(message: any) {
    if (message && message.codes && message.errors) {
      message.codes.forEach((code: string, index: number) => {
        const input = this.form.inputs.find(item => item.key === code);
        if (input) {
          input.error = message.errors[index];
        }
      })
    }
  }

  resetFormErrors() {
    this.form.inputs.forEach(input => {
      input.error = '';
    })
  }

}
