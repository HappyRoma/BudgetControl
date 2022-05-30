import { Pipe, PipeTransform } from '@angular/core';
import { LogService } from '../services/log/log.service';
import { MoneyType } from '../../../models/classes/moneyType.class';

@Pipe({
    name: 'customCurrency',
    pure: false
})
export class CustomCurrencyPipe implements PipeTransform {

    private _currencyIcon: string = '';

    constructor(private _service: LogService) {
        this._service.$currentMoneyType.subscribe((value: MoneyType) => {
            this._currencyIcon = value.icon;
        });
    }

    public transform(value: number, ...args: string[]): string {
        return this.transformValue(value);
    }

    private transformValue(value: number): string {
        switch (this._currencyIcon) {
            case '$':
                return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
            case '€':
                return value.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
            default:
                return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 });
        }
    }

}
