import {Component, Injectable, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LogService} from "../../log.service";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  constructor(private logService: LogService) {
  }

  ngOnInit(): void {
  }

  //разобраться с этой залупиной. Как работать с Subject. Как сделать так, чтобы в жругие компоненты все нормально уходило. Как сделать нормальные инпуты

  moneyList = this.logService.moneyTypesList;

  settingForm = new FormGroup({
    nameValue: new FormControl(this.logService.username.getValue(), Validators.required),
    emailValue: new FormControl(this.logService.userEmail, [Validators.required, Validators.email]),
    moneyValue: new FormControl(this.logService.currentMoneyType, Validators.required)
  })

  onSubmit() {
    const controls = this.settingForm.controls;

    if (this.settingForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      return;
    }
    this.logService.setUsername(this.settingForm.value.nameValue);
    this.logService.userEmail = this.settingForm.value.emailValue;
    this.logService.currentMoneyType = this.settingForm.value.moneyValue;
  }
}
