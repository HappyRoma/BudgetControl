import {IUser} from "../interfaces/user.interface";
import {MoneyType} from "./moneyType.class";
import {Card} from "./card.model";
import {Operation} from "./operation.model";
import {Category} from "./category.model";

export class User implements IUser {
  name: string = '';
  email: string = '';
  currentMoneyType: MoneyType = new MoneyType("Российский рубль", "₽");
  categoryList: Category[] = [];
  operationList: Operation[] = [];
  cardList: Card[] = [];

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  // addCategory(category: Category): void {
  //   let index = this.categoryList.findIndex(el => el.name == category.name);
  //   if (index !== -1) {
  //     throw new Error("Категория с таким именем уже существует");
  //   }
  //   this.categoryList.push(category);
  // }
  //
  // removeCategory(category: Category): void {
  //   let index = this.categoryList.findIndex(el => el.name == category.name);
  //   if (index == -1) {
  //     throw new Error("Категория не найдена");
  //   }
  //   this.categoryList.splice(index, 1);
  // }
  //
  // addCard(card: Card): void {
  //   let index = this.cardList.findIndex(el => el.name == card.name);
  //   if (index !== -1) {
  //     throw new Error("Карта с таким именем уже существует");
  //   }
  //   this.cardList.push(card);
  // }
  //
  // removeCard(card: Card): void {
  //   let index = this.cardList.findIndex(el => el.name == card.name);
  //   if (index == -1) {
  //     throw new Error("Категория не найдена");
  //   }
  //   this.cardList.splice(index, 1);
  // }
}
