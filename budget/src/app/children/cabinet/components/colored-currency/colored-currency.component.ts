import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'colored-currency',
  template: `
    <span [ngStyle]="{color: negativeValue(value) ? 'red' : 'green'}"> {{res | customCurrency}} </span>
  `,
})
export class ColoredCurrencyComponent implements OnInit {

  @Input() value!: number;

  res: number = 0;

  public negativeValue(a: number) {
    return a < 0;
  }

  constructor() {
  }

  ngOnInit(): void {
    if (this.value) {
      this.res = this.value < 0 ? +this.value.toString().slice(1) : this.value;
    }
  }

}
