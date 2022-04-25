import {MoneyType} from "../classes/moneyType.class";

export interface IUser {
  /** Уникальный идентификатор пользователя */
  uid: string
  /** Имя для отображения в Кабинете **/
  name: string;
  /** Email/Логин пользователя **/
  email: string;
  /** Валюта пользователя **/
  currentMoneyType: MoneyType;
  /** Фото профиля **/
  avatar?: string;
}
