import { FormControl, FormGroup } from '@angular/forms';

export function fieldMatchValidator(fieldKey: string, confirmFieldKey: string) {
  return (control: FormControl): { [key: string]: any } | null => {
    const formGroup = control.parent as FormGroup;
    const field = formGroup?.get(fieldKey);
    const confirmField = formGroup?.get(confirmFieldKey);
    if (field?.value !== confirmField?.value) {
      return {
        fieldMatch: true
      };
    }
    return null;
  };
}
