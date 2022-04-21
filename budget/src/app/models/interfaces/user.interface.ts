import {MoneyType} from "../classes/moneyType.class";
import {Card} from "../classes/card.model";
import {Category} from "../classes/category.model";
import {Operation} from "../classes/operation.model";

export interface IUser {
  /** Имя для отображения в Кабинете **/
  name: string;
  /** Email/Логин пользователя **/
  email: string;
  /** Валюта пользователя **/
  currentMoneyType: MoneyType;
  /** Список категорий пользователя **/
  categoryList: Category[];
  /** Список операция пользователя **/
  operationList: Operation[];
  /** Карты пользователя **/
  cardList: Card[];
  /** Фото профиля **/
  avatar?: string;
}
