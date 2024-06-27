import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppForm, AppFormInputs} from '../../shared/types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  @Input() form!: AppForm;
  @Input() formGroup!: FormGroup;
  @Output() onClickButton: EventEmitter<any> = new EventEmitter<any>();

  button(input: AppFormInputs) {
    this.onClickButton.emit(input);
  }

}
