import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';


function isEmptyInputValue(value: string): boolean {
    return value === null || value.length === 0;
}

export class CustomValidators {
    public static emailValidator(control: FormControl): ValidationErrors | null {
        const emailPattern: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

        if (isEmptyInputValue(control.value)) {
            return null;
        }

        return emailPattern.test(control.value) ? null : { 'email': true };
    }

    public static passwordValidator(control: FormControl): ValidationErrors | null {
        const hasNumber: boolean = /[0-9]/.test(control.value);
        const hasCapitalLetter: boolean = /[A-Z]/.test(control.value);
        const hasLowercaseLetter: boolean = /[a-z]/.test(control.value);
        const isLengthValid: boolean = control.value ? control.value.length > 7 : false;

        if (isEmptyInputValue(control.value)) {
            return null;
        }

        if (!hasNumber) {
            return { 'noNumber': true };
        }

        if (!hasCapitalLetter) {
            return { 'CapitalLetter': true };
        }

        if (!hasLowercaseLetter) {
            return { 'LowercaseLetter': true };
        }

        if (!isLengthValid) {
            return { 'LengthValid': true };
        }

        return null;
    }

    public static passwordMatchValidator(password: string, confirmPassword: string) {
        return (group: FormGroup): void => {
            if (group.controls[password].value !== group.controls[confirmPassword].value) {
                group.controls[confirmPassword].setErrors({ 'equalityPassword': true });
            } else {
                group.controls[confirmPassword].setErrors(null);
            }
        };
    }
}
