import {MoneyType} from "../classes/moneyType.class";
import {Category} from "../classes/category.model";

export interface IUser {
  /** Уникальный идентификатор пользователя */
  uid: string
  /** Имя для отображения в Кабинете **/
  name: string;
  /** Email/Логин пользователя **/
  email: string;
  /** Валюта пользователя **/
  currentMoneyType: MoneyType;
  /** Список всех категорий пользователя */
  categoryList: Category[];
  /** Фото профиля **/
  avatar?: string;
}
