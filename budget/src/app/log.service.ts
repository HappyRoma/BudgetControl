import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

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

  constructor() {}

  username: BehaviorSubject<string> = new BehaviorSubject<string>("Пользователь228");
  $username: Observable<string> = this.username.asObservable();

  userEmail: string = "";

  moneyTypesList = [new MoneyType("Российский рубль", "₽"),
    new MoneyType("Американский доллар", "$"),
    new MoneyType("Евро", "€")];

  currentMoneyType:BehaviorSubject<MoneyType> = new BehaviorSubject<MoneyType>(this.moneyTypesList[0]);
  $currentMoneyType: Observable<MoneyType> = this.currentMoneyType.asObservable();

  setUsername(newName: string): void {
    this.username.next(newName);
  }

  setCurrentMoneyType(newCurrentMoneyType: MoneyType): void {
    this.currentMoneyType.next(newCurrentMoneyType);
  }
}
