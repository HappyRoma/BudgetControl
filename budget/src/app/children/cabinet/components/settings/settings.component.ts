import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LogService} from "../../services/log/log.service";
import {CustomValidators} from "../../../../validators/validators";
import {AppComponent} from "../../../../app.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  constructor(private logService: LogService, private notify: AppComponent) {
  }

  ngOnInit(): void {
  }


  moneyList = this.logService.moneyTypesList;

  settingForm = new FormGroup({
    nameValue: new FormControl(this.logService.username.getValue(), [Validators.required, Validators.maxLength(20)]),
    emailValue: new FormControl(this.logService.userEmail, [Validators.required, CustomValidators.emailValidator]),
    moneyValue: new FormControl(this.logService.currentMoneyType.getValue(), Validators.required)
  })

  getError(control: string, error: string): boolean {
    return this.settingForm.get(control)?.getError(error);
  }

  onSubmit() {
    const controls = this.settingForm.controls;

    if (this.settingForm.invalid) {
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

      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      return;
    }
    this.logService.setUsername(this.settingForm.value.nameValue);
    this.logService.setUserEmail(this.settingForm.value.emailValue);
    this.logService.setCurrentMoneyType(this.settingForm.value.moneyValue);
    this.notify.showNotification("Успешно", "Ваши данные сохранены.", "success");
  }
}
