import {FormControl, ValidationErrors} from "@angular/forms";

function isEmptyInputValue(value: string): boolean {
  return value == null || value.length === 0;
}

export function emailValidator(control: FormControl): ValidationErrors|null {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (isEmptyInputValue(control.value)) {
      return null;
    }

    return emailPattern.test(control.value) ? null : {'email': true};
}
