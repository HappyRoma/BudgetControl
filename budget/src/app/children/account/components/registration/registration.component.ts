import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { CustomValidators } from '../../../../validators/validators';
import { AppComponent } from '../../../../app.component';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['/../styles/components.styles.css']
})
export class RegistrationComponent {

    public registrationForm: FormGroup = this._formBuild.group({
        nameValue: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        emailValue: new FormControl('', [Validators.required, CustomValidators.emailValidator]),
        password: new FormControl('', [Validators.required, CustomValidators.passwordValidator]),
        repeatPassword: new FormControl('', [Validators.required])
    }, { validators: CustomValidators.passwordMatchValidator('password', 'repeatPassword') });

    private _firebaseError: string = '';

    constructor(private _router: Router,
                private _authService: FirebaseAuthService,
                private _formBuild: FormBuilder,
                private _notify: AppComponent) {
        this._authService.$errorText.subscribe((error: string) => this._firebaseError = error);
    }

    async onSignup(email: string, password: string, name: string) {
        await this._authService.Signup(email, password, name)
            .then(()=>{
                if (this._firebaseError === 'auth/email-already-in-use') {
                    this._notify.showNotification('Ошибка регистрации', 'Почта уже используется', 'error');
                }
                else if (this._firebaseError === 'auth/too-many-requests') {
                    this._notify.showNotification('too-many-requests', 'too-many-requests', 'error');
                }
                else {
                    this._notify.showNotification('Успешно', 'Вы зарегистрировались', 'success');
                    this._router.navigate(['cabinet/home']);
                }
            });
    }

    public isFormDirty(): boolean {
        return this.registrationForm.dirty;
    }

    public onSubmit(): void {
        const controls = this.registrationForm.controls;

        if (this.registrationForm.invalid) {
            if (this.getError('nameValue', 'required')) {
                this._notify.showNotification('Имя', 'Это обязательное поле', 'error');
            }
            if (this.getError('nameValue', 'maxlength')) {
                this._notify.showNotification('Имя', 'Максимальное количество символов - 20', 'error');
            }
            if (this.getError('emailValue', 'required')) {
                this._notify.showNotification('Почта', 'Это обязательное поле', 'error');
            }
            if (this.getError('emailValue', 'email')) {
                this._notify.showNotification('Почта', 'Почта должна иметь вид: example@kek.gg', 'error');
            }
            if (this.getError('password', 'required')) {
                this._notify.showNotification('Пароль', 'Это обязательное поле', 'error');
            }
            if (this.getError('password', 'noNumber') ||
            this.getError('password', 'CapitalLetter') ||
            this.getError('password', 'LowercaseLetter') ||
            this.getError('password', 'LengthValid')) {
                this._notify.showNotification('Пароль', 'Пароль должен содержать: \n  -Хотя бы 1 цифру \n -Хотя бы 1 заглавную букву \n -Хотя бы 1 строчную букву ' +
          '\n -Длинну больше 7 символов', 'error');
            }
            if (this.getError('repeatPassword', 'equalityPassword')) {
                this._notify.showNotification('Пароль', 'Пароли не совпадают', 'error');
            }

            Object.keys(controls).forEach((controlName: string) => controls[controlName].markAsTouched());

            return;
        }
        this.registrationForm.markAsPristine();
        this.onSignup(controls['emailValue'].value, controls['password'].value, controls['nameValue'].value);
    }

    private getError(control: string, error: string): boolean {
        return this.registrationForm.get(control)?.getError(error);
    }

}
