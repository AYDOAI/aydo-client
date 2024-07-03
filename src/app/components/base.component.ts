import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from "rxjs";

import {AppFormInputs} from '../shared/types';
import {BackendService} from '../services/backend.service';
import {ErrorsService} from "../services/errors.service";
import {StorageService} from "../services/storage.service";
import {UIService} from '../services/ui.service';

// @ts-ignore
export const emailRegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

@Component({
  selector: 'app-base',
  template: '',
})
export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  errorSub: Subscription;

  constructor(
    public ui: UIService,
    public backend: BackendService,
    public errors: ErrorsService,
    public storage: StorageService,
    public fb: FormBuilder,
  ) {
    this.onCreate();
    this.errorSub = this.errors.errorSub().subscribe((message: any) => {
      this.onError(message);
    });
  }

  onError(message: any) {

  }

  onCreate() {

  }

  onInit() {

  }

  onDestroy() {

  }

  onAfterViewInit() {

  }

  ngOnInit() {
    this.onInit();
  }

  ngAfterViewInit() {
    this.onAfterViewInit();
  }

  ngOnDestroy() {
    this.onDestroy();
    this.errorSub.unsubscribe();
  }

  createInput(input: AppFormInputs) {
    const opts: any[] = [];
    if (input.minLength) {
      // @ts-ignore
      opts.push(Validators.minLength(input.minLength));
    }
    if (input.maxLength) {
      // @ts-ignore
      opts.push(Validators.maxLength(input.maxLength));
    }
    if (input.email) {
      // @ts-ignore
      opts.push(Validators.pattern(emailRegExp));
    }
    if (input.number) {
      // @ts-ignore
      opts.push(Validators.pattern('^[0-9]*$'));
    }
    if (input.required) {
      // @ts-ignore
      opts.push(Validators.required);
    }
    const control = new FormControl('', opts);
    if (input.defaultValue) {
      control.setValue(input.defaultValue);
    }
    return control;
  }

  createForm(inputs: AppFormInputs[]) {
    const controls: any = {};
    // @ts-ignore
    inputs.forEach((input: InputControl) => {
      if (input.type !== 'button') {
        if (input.group) {
          controls[input.key] = this.fb.array([]);
        } else {
          controls[input.key] = this.createInput(input);
        }
      }
    });
    return new FormGroup(controls);
  }

}
