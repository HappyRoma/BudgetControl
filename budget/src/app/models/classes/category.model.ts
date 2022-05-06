import {ICategory} from "../interfaces/category.interface";
import {Operation} from "./operation.model";

export class Category implements ICategory {
  name: string = '';
  color: string = '';
  icon: string = '';
  operationList?: Operation[] = [];

  constructor(name: string, color: string, icon: string) {
    this.name = name;
    this.color = color;
    this.icon = icon;
  }
}
