import {ICard} from "../interfaces/card.interface";

export class Card implements ICard {
  name: string = '';
  amount: number = 0;
  color: string = '';
  icon: string = '';

  constructor(name: string, color: string, icon: string, amount:number = 0) {
    this.name = name;
    this.amount = amount;
    this.color = color;
    this.icon = icon;
  }
}
