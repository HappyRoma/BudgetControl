import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LogService} from "../../log.service";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  currencyIcon: string = "";

  constructor(private logService: LogService) {
    this.logService.$currentMoneyType.subscribe(moneyType => this.currencyIcon = moneyType.icon);
  }

  ngOnInit(): void {
  }

  moneyList = this.logService.moneyTypesList;

  settingForm = new FormGroup({
    nameValue: new FormControl(this.logService.username.getValue(), [Validators.required, Validators.maxLength(20)]),
    emailValue: new FormControl(this.logService.userEmail, [Validators.required, Validators.email]),
    moneyValue: new FormControl(this.logService.currentMoneyType.getValue(), Validators.required)
  })

  onSubmit() {
    const controls = this.settingForm.controls;

    if (this.settingForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      return;
    }
    this.logService.setUsername(this.settingForm.value.nameValue);
    this.logService.userEmail = this.settingForm.value.emailValue;
    this.logService.setCurrentMoneyType(this.settingForm.value.moneyValue);
  }
}
