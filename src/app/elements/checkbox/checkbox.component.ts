import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import {FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseElement} from '../base.component';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }]
})
export class CheckboxComponent extends BaseElement {
  @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
  @Input() title!: string;
  @Input() form!: FormGroup;
  @Input() key!: string;
  @Input() error: any;
  @Input() readonly = false;

  onInit() {
    if (this.form) {
      // this.form.valueChanges.subscribe(val => {
      //   delete this.ui.errors[this.name];
      //   delete this.ui.errors['message'];
      // });
    }
  }

  touchend(ev: any) {
    ev.stopPropagation();
  }

}
