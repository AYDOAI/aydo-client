import { FormControl } from '@angular/forms';

export function emailSpecialCharValidator() {
  return (control: FormControl): { [key: string]: any } | null => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const value = control.value;

    if (value && !regex.test(value)) {
      return {
        emailSpecialCharacters: true
      };
    }

    return null;
  };
}
