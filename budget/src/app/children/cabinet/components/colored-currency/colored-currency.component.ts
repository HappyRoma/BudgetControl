import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'colored-currency',
    template: `
        <span [ngStyle]="{color: negativeValue(val) ? 'red' : 'green'}"> {{res | customCurrency}} </span>
    `,
})
export class ColoredCurrencyComponent implements OnInit {

  @Input() public value!: number | Observable<number>;

  public val: number = 0;
  public res: number = 0;

  constructor() {
  }

  public ngOnInit(): void {
      if (typeof this.value === 'number') {
          this.val = this.value;
          this.res = this.value < 0 ? +this.value.toString().slice(1) : this.value;
      }
      else {
          this.value.subscribe((value1: number) => {
              this.val = value1;
              this.res = value1 < 0 ? +value1.toString().slice(1) : value1;
          });
      }
  }

  public negativeValue(a: number): boolean {
      return a < 0;
  }

}
