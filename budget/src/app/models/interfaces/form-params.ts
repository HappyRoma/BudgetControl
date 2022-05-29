import {Category} from "../classes/category.model";
import {Card} from "../classes/card.model";

export interface CategoryFormParams {
  name: string,
  colorIndex: number,
  iconIndex: number
}

export interface OperationFormParams {
  category: Category,
  date: string,
  value: number,
  card: Card
}
