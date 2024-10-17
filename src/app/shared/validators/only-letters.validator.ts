import { FormControl } from '@angular/forms';

export function onlyLettersValidator() {
  return (control: FormControl): { [key: string]: any } | null => {
    const regex = /^[a-zA-Z]+$/;
    const value = control.value;

    if (value && !regex.test(value)) {
      return {
        onlyLetters: true
      };
    }

    return null;
  };
}
