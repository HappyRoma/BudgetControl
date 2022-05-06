import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'colored-currency',
  template: `
    <span [ngStyle]="{color: negativeValue(val) ? 'red' : 'green'}"> {{res | customCurrency}} </span>
  `,
})
export class ColoredCurrencyComponent implements OnInit {

  @Input() value!: number | Observable<number>;

  val: number = 0;
  res: number = 0;

  public negativeValue(a: number) {
    return a < 0;
  }

  constructor() {
  }

  ngOnInit(): void {
    if (typeof this.value === 'number') {
      this.val = this.value;
      this.res = this.value < 0 ? +this.value.toString().slice(1) : this.value;
    }
    else {
      this.value.subscribe(value1 => {
        this.val = value1;
        this.res = value1 < 0 ? +value1.toString().slice(1) : value1;
      })
    }
  }

}
