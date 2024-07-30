import {Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild} from '@angular/core';
import {FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseElement} from '../base.component';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true
};

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class InputComponent extends BaseElement {

  @Output() onEnter: EventEmitter<any> = new EventEmitter<any>();
  @Input() title!: string;
  @Input() type!: string | undefined;
  @Input() form!: FormGroup;
  @Input() key!: string;
  @Input() placeholder!: string;
  @Input() error: any;
  @Input() noPadding = false;
  @Input() readonly = false;
  @Input() icon = true;
  @Input() rows = 10;

  onInit() {
    if (this.form) {
      // this.form.valueChanges.subscribe(val => {
      //   delete this.ui.errors[this.name];
      //   delete this.ui.errors['message'];
      // });
    }
  }

  keyUp(ev: any) {
    if (ev.key === 'Enter') {
      this.onEnter.emit();
    }
  }

  edit(): void {
    // @ts-ignore
    const inputElement: HTMLInputElement = this.element.nativeElement.querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  }

  touchend(ev: any) {
    ev.stopPropagation();
  }

}
