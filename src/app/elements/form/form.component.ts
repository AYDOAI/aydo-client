import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppForm, AppFormInputs, FrameStep} from '../../shared/types';
import {BaseElement} from '../base.component';
import { Location } from "@angular/common";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent extends BaseElement {

  @Input() form!: AppForm;
  @Input() formGroup!: FormGroup;
  @Input() back!: FrameStep;
  @Output() onClickButton: EventEmitter<any> = new EventEmitter<any>();

  private location = inject(Location);

  button(input: AppFormInputs) {
    this.onClickButton.emit(input);
  }

  goBack() {
    this.location.back();
  }
}
