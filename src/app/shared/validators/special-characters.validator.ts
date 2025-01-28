import { FormControl } from '@angular/forms';

export function specialCharactersValidator() {
  return (control: FormControl): { [key: string]: any } | null => {
    const regex = /^[a-zA-Z0-9 +-]*$/;
    const value = control.value;

    if (value && !regex.test(value)) {
      return {
        specialCharacters: true,
      };
    }

    return null;
  };
}
