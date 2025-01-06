import { FormArray, FormGroup, AbstractControl } from '@angular/forms';

export function validateFormControls(form: FormGroup | FormArray): void {
  Object.keys(form.controls).forEach((field) => {
    const control = form.get(field) as AbstractControl;
    if (control) {
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });

      if (control instanceof FormGroup || control instanceof FormArray) {
        validateFormControls(control);
      }
    }
  });
}
