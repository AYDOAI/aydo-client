import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppForm, AppFormInputs, FrameStep} from '../../shared/types';
import {BaseElement} from '../base.component';

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

  button(input: AppFormInputs) {
    this.onClickButton.emit(input);
  }

  goBack() {
    this.ui.goStep(this.back);
  }
}
