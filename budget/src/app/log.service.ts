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

  currentMoneyType:MoneyType = this.moneyTypesList[0];

  setUsername(newName: string) {
    this.username.next(newName);
  }
}
