import {Pipe, PipeTransform} from '@angular/core';
import {LogService} from "../log.service";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  currencyIcon: string = '';
  res: string = '';

  constructor(private logService: LogService, private sanitized: DomSanitizer) {
    this.logService.$currentMoneyType.subscribe(MoneyType => this.currencyIcon = MoneyType.icon);
  }

  transform(value: number, ...args: string[]) {
    if (value >= 0) {
      this.res = "<div style='color: green'>" + value.toString() + ' ' + this.currencyIcon + "</div>";
    }
    else {
      this.res = "<div style='color: red'>" + value.toString().slice(1) + this.currencyIcon + "</div>"
    }
  //надо как-то изменить вывод цвета, не через иннерХТМЛ
    return this.sanitized.bypassSecurityTrustHtml(this.res);
  }
}
