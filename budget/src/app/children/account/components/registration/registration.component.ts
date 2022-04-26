import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {CustomValidators} from "../../../../validators/validators";
import {AppComponent} from "../../../../app.component";
import {FirebaseAuthService} from "../../services/firebase-auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['/../styles/components.styles.css']
})
export class RegistrationComponent implements OnInit {

  firebaseError: string = '';

  constructor(private router: Router, private authService: FirebaseAuthService, private formBuild: FormBuilder, private notify: AppComponent) {
    this.authService.$errorText.subscribe(error => this.firebaseError = error);
  }

  ngOnInit(): void {
  }

  async onSignup(email: string, password: string, name: string) {
    await this.authService.Signup(email, password, name)
      .then(()=>{
        if (this.firebaseError == 'auth/email-already-in-use') {
          this.notify.showNotification("Ошибка регистрации", "Почта уже используется", "error");
        }
        else if (this.firebaseError == 'auth/too-many-requests') {
          this.notify.showNotification("too-many-requests", "too-many-requests", "error");
        }
        else {
          this.notify.showNotification("Успешно", "Вы зарегистрировались", "success");
          this.router.navigate(['login/sign-in']);
        }
      });
  }

  registrationForm = this.formBuild.group({
    nameValue: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    emailValue: new FormControl('', [Validators.required, CustomValidators.emailValidator]),
    password: new FormControl('', [Validators.required, CustomValidators.passwordValidator]),
    repeatPassword: new FormControl('', [Validators.required])
  }, {validators: CustomValidators.passwordMatchValidator('password', 'repeatPassword')});


  getError(control: string, error: string): boolean {
    return this.registrationForm.get(control)?.getError(error);
  }

  isFormDirty(): boolean {
    return this.registrationForm.dirty;
  }

  onSubmit() {
    const controls = this.registrationForm.controls;

    if (this.registrationForm.invalid) {
      if (this.getError("nameValue", "required")) {
        this.notify.showNotification("Имя", "Это обязательное поле", "error");
      }
      if (this.getError("nameValue", "maxlength")) {
        this.notify.showNotification("Имя", "Максимальное количество символов - 20", "error");
      }
      if (this.getError("emailValue", "required")) {
        this.notify.showNotification("Почта", "Это обязательное поле", "error");
      }
      if (this.getError("emailValue", "email")) {
        this.notify.showNotification("Почта", "Почта должна иметь вид: example@kek.gg", "error");
      }
      if (this.getError("password", "required")) {
        this.notify.showNotification("Пароль", "Это обязательное поле", "error");
      }
      if (this.getError("password", "noNumber") ||
            this.getError("password", "CapitalLetter") ||
            this.getError("password", "LowercaseLetter") ||
            this.getError("password", "LengthValid")) {
        this.notify.showNotification("Пароль", "Пароль должен содержать: \n  -Хотя бы 1 цифру \n -Хотя бы 1 заглавную букву \n -Хотя бы 1 строчную букву " +
          "\n -Длинну больше 7 символов", "error");
      }
      if (this.getError("repeatPassword", "equalityPassword")) {
        this.notify.showNotification("Пароль", "Пароли не совпадают", "error")
      }

      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      return
    }
    this.registrationForm.markAsPristine();
    this.onSignup(controls['emailValue'].value, controls['password'].value, controls['nameValue'].value);
  }

}
