import { FormControl } from '@angular/forms';

export function strongPasswordValidator() {
  return (control: FormControl): { [key: string]: any } | null => {
    const value = control.value;

    const minLength = 8;
    const minLowercase = 1;
    const minUppercase = 1;
    const minNumbers = 1;
    const minSymbols = 1;

    const lowerCaseRegex = new RegExp(`(?=(.*[a-z]){${minLowercase}})`);
    const upperCaseRegex = new RegExp(`(?=(.*[A-Z]){${minUppercase}})`);
    const numberRegex = new RegExp(`(?=(.*\\d){${minNumbers}})`);
    const symbolRegex = new RegExp(`(?=(.*[!@#$%^&*(),.?":{}|<>]){${minSymbols}})`);

    const isValid =
      value?.length >= minLength &&
      lowerCaseRegex.test(value) &&
      upperCaseRegex.test(value) &&
      numberRegex.test(value) &&
      symbolRegex.test(value);

    if (value && !isValid) {
      return { strongPassword: true }
    }

    return null;
  };
}
