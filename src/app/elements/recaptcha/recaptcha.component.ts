import {
  Component,
  forwardRef,
  Input
} from '@angular/core';
import {FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseElement} from '../base.component';
import {environment} from '../../../environments/environment';

export const CUSTOM_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RecaptchaComponent),
  multi: true
};

@Component({
  selector: 'app-recaptcha',
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.scss'],
  providers: [CUSTOM_CONTROL_VALUE_ACCESSOR]
})
export class RecaptchaComponent extends BaseElement {

  @Input() form!: FormGroup;
  @Input() key!: string;

  public siteKey = environment.recaptcha.sitekey;
  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'compact';
  public lang = 'en';
  public type: 'image' | 'audio' = 'image';
}
