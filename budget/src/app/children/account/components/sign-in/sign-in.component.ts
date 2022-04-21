import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppComponent} from "../../../../app.component";
import {FirebaseAuthService} from "../../services/firebase-auth.service";
import {getAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['/../styles/components.styles.css']
})
export class SignInComponent implements OnInit {

  isHiddenPassword: boolean = true;
  passwordType: string = "password";
  firebaseError: string = '';

  constructor(private notify: AppComponent, private authService: FirebaseAuthService) {
    this.authService.$errorText.subscribe(error => this.firebaseError = error);
  }

  ngOnInit(): void {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user?.uid);
  }

  async onSignin(login: string, password: string) {
    await this.authService.Signin(login, password)
      .then(() => {
          if (this.firebaseError == 'auth/wrong-password') {
            this.notify.showNotification("Ошибка авторизации", "Неверный пароль", "error");
          }
          else if (this.firebaseError == 'auth/user-not-found') {
            this.notify.showNotification("Ошибка авторизации", "Пользователь с данной почтной не найден", "error");
          }
          else if (this.firebaseError == 'auth/too-many-requests') {
            this.notify.showNotification("too-many-requests", "too-many-requests", "error");
          }
          else {
            this.notify.showNotification("Успешно", "Вы вошли", "success");
          }
        }
      );
  }

  onSignOut() {
    this.authService.SignOut();
  }

  showPassword(opt: boolean) {
    if (opt) {
      this.passwordType = "text";
      this.isHiddenPassword = false;
    }
    else {
      this.passwordType = "password";
      this.isHiddenPassword = true;
    }
  }

  signInForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  getError(control: string, error: string): boolean {
    return this.signInForm.get(control)?.getError(error);
  }

  onSubmit() {
    const controls = this.signInForm.controls;

    if (this.signInForm.invalid) {
      if (this.getError("login", "required")) {
        this.notify.showNotification("Имя", "Это обязательное поле", "error");
      }
      if (this.getError("password", "required")) {
        this.notify.showNotification("Пароль", "Это обязательное поле", "error");
      }

      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      return
    }
    this.onSignin(controls['login'].value, controls['password'].value);
  }

}
