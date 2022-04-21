import {Category} from "../classes/category.model";
import {Card} from "../classes/card.model";

export interface IOperation {
  /** Категория операции **/
  category: Category;
  /** Дата операции **/
  date: Date;
  /** Сумма операции **/
  value: number;
  /** Карта списания **/
  card: Card;
}
