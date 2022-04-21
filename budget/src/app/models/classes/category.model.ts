import {ICategory} from "../interfaces/category.interface";

export class Category implements ICategory {
  name: string = '';
  color: string = '';
  icon: string = '';

  constructor(name: string, color: string, icon: string) {
    this.name = name;
    this.color = color;
    this.icon = icon;
  }
}
