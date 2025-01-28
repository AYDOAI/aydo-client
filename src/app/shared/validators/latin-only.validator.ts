import { FormControl } from '@angular/forms';

export function latinOnly() {
  return (control: FormControl): { [key: string]: any } | null => {
    const regex = /^[^а-яё]+$/i;
    const value = control.value;

    if (value && !regex.test(value)) {
      return {
        latinOnly: true,
      };
    }

    return null;
  };
}
