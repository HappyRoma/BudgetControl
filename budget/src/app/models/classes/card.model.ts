import {ICard} from "../interfaces/card.interface";

export class Card implements ICard {
  name: string;
  amount: number;

  constructor(name: string, amount:number = 0) {
    this.name = name;
    this.amount = amount;
  }

  plusMoney(value: number) {
    this.amount += value;
  }

  subtractMoney(value: number) {
    this.amount -= value;
  }
}
