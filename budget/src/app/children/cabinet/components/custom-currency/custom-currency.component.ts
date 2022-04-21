import {Component, Input, OnInit} from '@angular/core';
import {LogService} from "../../services/log.service";

@Component({
  selector: 'custom-currency',
  template: `
    <span [ngStyle]="{color: negativeValue(value) ? 'red' : 'green'}"> {{res + currencyIcon}} </span>
  `,
})
export class CustomCurrencyComponent implements OnInit {

  @Input() value!: number;

  currencyIcon: string = '';
  res: string = '';

  public negativeValue(a: number) {
    return a < 0;
  }

  constructor(private logService: LogService) {
    this.logService.$currentMoneyType.subscribe(MoneyType => this.currencyIcon = MoneyType.icon);
  }

  ngOnInit(): void {
    if (this.value) {
      this.res = this.value < 0 ? this.value.toString().slice(1) : this.value.toString();
    }
  }

}
