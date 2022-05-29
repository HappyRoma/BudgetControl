import {IOperation} from "../interfaces/operation.interface";

export class Operation implements IOperation {
  categoryName: string | null;
  date: string;
  value: number;
  card: string;
  id: string;

  constructor(category: string, date: string, value: number, card: string, id: string) {
    this.categoryName = category;
    this.date = date;
    this.value = value;
    this.card = card;
    this.id = id;
  }
}
