import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../../app.component';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Auth, getAuth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['/../styles/components.styles.css']
})
export class SignInComponent implements OnInit {

    public isHiddenPassword: boolean = true;
    public passwordType: string = 'password';

    public signInForm: FormGroup = new FormGroup({
        login: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    private _firebaseError: string = '';

    constructor(private _notify: AppComponent, private _authService: FirebaseAuthService, private _router: Router) {
        this._authService.$errorText.subscribe((error: string) => this._firebaseError = error);
    }

    public ngOnInit(): void {
        const auth: Auth = getAuth();
        const user: User | null = auth.currentUser;
        console.log(user?.uid);
    }

    async onSignin(login: string, password: string) {
        await this._authService.Signin(login, password)
            .then(() => {
                if (this._firebaseError === 'auth/wrong-password') {
                    this._notify.showNotification('Ошибка авторизации', 'Неверный пароль', 'error');
                }
                else if (this._firebaseError === 'auth/user-not-found') {
                    this._notify.showNotification('Ошибка авторизации', 'Пользователь с данной почтной не найден', 'error');
                }
                else if (this._firebaseError === 'auth/too-many-requests') {
                    this._notify.showNotification('too-many-requests', 'too-many-requests', 'error');
                }
                else {
                    this._notify.showNotification('Вы вошли', 'Добро пожаловать!', 'success');
                    this._router.navigate(['cabinet/home']);
                }
            }
            );
    }

    public showPassword(opt: boolean): void {
        if (opt) {
            this.passwordType = 'text';
            this.isHiddenPassword = false;
        }
        else {
            this.passwordType = 'password';
            this.isHiddenPassword = true;
        }
    }

    public onSubmit(): void {
        const controls = this.signInForm.controls;

        if (this.signInForm.invalid) {
            if (this.getError('login', 'required')) {
                this._notify.showNotification('Имя', 'Это обязательное поле', 'error');
            }
            if (this.getError('password', 'required')) {
                this._notify.showNotification('Пароль', 'Это обязательное поле', 'error');
            }

            Object.keys(controls).forEach((controlName: string) => controls[controlName].markAsTouched());

            return;
        }
        this.onSignin(controls['login'].value, controls['password'].value);
    }

    private getError(control: string, error: string): boolean {
        return this.signInForm.get(control)?.getError(error);
    }

}
