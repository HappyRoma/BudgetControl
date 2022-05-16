import {IOperation} from "../interfaces/operation.interface";

export class Operation implements IOperation {
  categoryName: string | null;
  date: string;
  value: number;
  card: string;

  constructor(category: string, date: string, value: number, card: string) {
    this.categoryName = category;
    this.date = date;
    this.value = value;
    this.card = card;
  }
}
