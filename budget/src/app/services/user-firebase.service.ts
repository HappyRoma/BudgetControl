import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Category} from "../models/classes/category.model";
import {Operation} from "../models/classes/operation.model";
import {Card} from "../models/classes/card.model";
import {getAuth, onAuthStateChanged, updateEmail} from "@angular/fire/auth";
import {BehaviorSubject, map, Observable} from "rxjs";
import {IUser} from "../models/interfaces/user.interface";
import {MoneyType} from "../models/classes/moneyType.class";

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService {

  private moneyTypesList = [new MoneyType("Российский рубль", "₽"),
    new MoneyType("Американский доллар", "$"),
    new MoneyType("Евро", "€")];

  private _user: BehaviorSubject<IUser> =  new BehaviorSubject<IUser>({
    uid: '',
    name: '',
    email: '',
    currentMoneyType: this.moneyTypesList[0]
  });

  private userPath?: AngularFirestoreDocument;
  private categoryListPath?: AngularFirestoreCollection<Category>;
  private operationListPath?: AngularFirestoreCollection<Operation>;
  private cardListPath?: AngularFirestoreCollection<Card>;

  private isDataLoaded: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);


  public get IsDataLoaded(): Observable<boolean | null> {
    return this.isDataLoaded.asObservable();
  }

  constructor(public dataBase: AngularFirestore) {
    this.LiveLoggedStatus();
  }

  private LiveLoggedStatus() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Юзер тут");
        this.isDataLoaded.next(true);
        this._user.pipe(
          map((value) =>  value.uid = user.uid)
        ).subscribe()
        this.createPaths();
      }
      else {
        console.log("Юзер убежал");
        this.isDataLoaded.next(false);
        this._user.pipe(
          map((value) => value.uid = '')
        ).subscribe()
      }
    })
  }

  /** Метод для создания путей в коллекции нынешнего пользователя и инициализации полей */
  private createPaths() {
    this.userPath = this.dataBase.collection('users').doc(this._user.getValue().uid);
    this.categoryListPath = this.userPath.collection('categoryList');
    this.operationListPath = this.userPath.collection('operationList');
    this.cardListPath = this.userPath.collection('cardList');
    this.userPath.valueChanges().subscribe(items => {
      if (items) {
        this._user.pipe(
          map((user) => user.name = items['name'])
        ).subscribe()
        this._user.pipe(
          map((user) => user.email = items['email'])
        ).subscribe();
        this._user.pipe(
          map((user) => {
            this.moneyTypesList.forEach(mtp => {
              if (mtp.toString() == items['currencyMoneyType']) {
                user.currentMoneyType = mtp;
              }
            })
          })
        ).subscribe()
        this._user.next(this._user.getValue())
        console.log(this._user.getValue());
      }
    });
  }

  /** Создание нового пользователя и его полей в хранилище */
  public createNewUser(email: string, name: string) {

    this.createPaths();

    this.userPath?.set({
      name: name,
      email: email,
      currencyMoneyType: this.moneyTypesList[0].toString()
    });
  }

  /** Авторизация пользователя */
  public signInUser() {

    this.createPaths();

  }

  /** Получить значение user */
  public get user() {
    return this._user.asObservable();
  }

  public get moneyTypeList() {
    return this.moneyTypesList;
  }

  /** Установить новое значение userName */
  public set userName(name: string) {
    if (this._user.getValue().name !== name) {
      this.userPath?.update({name: name})
    }
  }

  /** Установить новое значение userEmail */
  public set userEmail(email: string) {
    if (this._user.getValue().email !== email) {
      this.userPath?.update({email: email})

      const auth = getAuth();
      // @ts-ignore
      updateEmail(auth.currentUser, email).then(() => {
        console.log("Почта изменена");
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  /** Установить новое значение userCurrencyMoneyType */
  public set userCurrencyMoneyType(newMT: MoneyType) {
    if (this._user.getValue().currentMoneyType !== newMT) {
      this.userPath?.update({currencyMoneyType: newMT.toString()})
    }
  }

  /** Добавление категории
   *
   * @param category - Объект Category. Категория должна иметь уникальное имя.
   * */
  addCategory(category: Category) {

  }
}
