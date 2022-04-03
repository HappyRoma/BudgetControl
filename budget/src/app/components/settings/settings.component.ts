import {Component, Injectable, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LogService} from "../../log.service";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  constructor(private logService: LogService) { }

  ngOnInit(): void {

  }

  moneyList = this.logService.moneyTypesList;

  settingForm = new FormGroup({
    nameValue: new FormControl(this.logService.username, Validators.required),
    emailValue: new FormControl('', [Validators.required, Validators.email]),
    moneyValue: new FormControl(this.logService.currentMoneyType, Validators.required)
  })

  onSubmit() {
    const controls = this.settingForm.controls;

    if (this.settingForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

      return;
    }
    this.logService.username = this.settingForm.value.nameValue;
    this.logService.currentMoneyType = this.settingForm.value.moneyValue;
  }
}
