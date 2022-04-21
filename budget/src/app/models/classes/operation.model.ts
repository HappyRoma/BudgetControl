import {IOperation} from "../interfaces/operation.interface";
import {Category} from "./category.model";
import {Card} from "./card.model";

export class Operation implements IOperation {
  category: Category;
  date: Date;
  value: number;
  card: Card;

  constructor(category: Category, date: Date, value: number, card: Card) {
    this.category = category;
    this.date = date;
    this.value = value;
    this.card = card;
  }
}
