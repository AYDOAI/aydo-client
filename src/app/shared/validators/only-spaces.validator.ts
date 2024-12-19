import { FormControl } from '@angular/forms';

export function onlySpacesValidator() {
  return (control: FormControl): { [key: string]: any } | null => {
    const isOnlyWhitespace = control.value && control.value.trim().length === 0;

    if (isOnlyWhitespace) {
      return {
        onlySpaces: true
      };
    }

    return null;
  };
}
