import { Injectable } from '@angular/core';

class MoneyType {
  constructor(readonly name: string, readonly icon: string) {}

  toString(): string {
    return `${this.name} - ${this.icon}`
  }
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  username: string = "Пользователь228";

  moneyTypesList = [new MoneyType("Российский рубль", "₽"),
    new MoneyType("Американский доллар", "$"),
    new MoneyType("Евро", "€")];

  currentMoneyType:MoneyType = this.moneyTypesList[0];

  constructor() { }
}
