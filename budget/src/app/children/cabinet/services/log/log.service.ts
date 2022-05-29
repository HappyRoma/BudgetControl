import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import { MoneyType } from '../../../../models/classes/moneyType.class';
import {UserFirebaseService} from "../../../../services/user-firebase.service";
import {IUser} from "../../../../models/interfaces/user.interface";
import {User} from "../../../../models/classes/user.model";
import {CategoryType, ICategory} from "../../../../models/interfaces/category.interface";
import {ICard} from "../../../../models/interfaces/card.interface";
import {Category} from "../../../../models/classes/category.model";
import {Operation} from "../../../../models/classes/operation.model";



@Injectable({
  providedIn: 'root'
})
export class LogService {

  public userInfo: IUser = new User();

  constructor(private userFBService: UserFirebaseService) {
    this.userFBService.user.subscribe(user => {
      this.userInfo = user;
      this.username.next(user.name);
      this.userEmail = user.email;
      this.currentMoneyType.next(user.currentMoneyType);
      this.operationList.next(user.operationList);
      this.categoryList.next(user.categoryList);
      this.setOperationsToCategoryList();
      this.cardList.next(user.cardList);
    });
  }

  public differentCategory: BehaviorSubject<Category> = new BehaviorSubject<Category>({
    name: 'Другое',
    color: 'grey',
    icon: '',
    type: 'expend',
    operationList: []
  });
  public differentCategory$: Observable<Category> = this.differentCategory.asObservable();

  private setOperationsToCategoryList(): void {
    this.categoryList.subscribe(category => {
        category.forEach(cat => cat.operationList = []);
      });
    this.differentCategory.subscribe(category => category.operationList = []);
    this.operationList.getValue().forEach(operation => {
      if (operation.categoryName === 'Другое') {
        this.differentCategory.pipe(
          map((cat) => {
            cat.operationList?.push(operation);
          })
        ).subscribe()
      }
      else {
        this.categoryList.subscribe(category => {
          category.find(cat => cat.name === operation.categoryName)?.operationList?.push(operation);
        })
      }
    })
  }

  private colorsArray = [
    '#ef5350',
    '#ea3f7a',
    '#aa46bc',
    '#7d56c1',
    '#5b6abf',
    '#41a4f4',
    '#29b5f5',
    '#26c4d9',
    '#26a59a',
    '#65ba6a',
    '#9bca65',
    '#d2df57',
    '#fdec58',
    '#fdc829',
    '#fda627',
    '#fd6f43',
    '#8c6d63',
    '#bcbcbd',
    '#778f9c',
  ];

  private catIconsArray = [
    'url("assets/icons/category-icons/shoppingBag.svg")',
    'url("assets/icons/category-icons/health.svg")',
    'url("assets/icons/category-icons/gift.svg")',
    'url("assets/icons/category-icons/food.svg")',
    'url("assets/icons/category-icons/film.svg")',
    'url("assets/icons/category-icons/family.svg")',
    'url("assets/icons/category-icons/bus.svg")',
    'url("assets/icons/category-icons/basket.svg")'
  ];

  private cardIconArray = [
    'url("assets/icons/card-icons/bank.svg")',
    'url("assets/icons/card-icons/coin.svg")',
    'url("assets/icons/card-icons/credit-card.svg")',
    'url("assets/icons/card-icons/piggy-bank.svg")',
    'url("assets/icons/card-icons/wallet.svg")',
  ];

  public categoryList: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  public $categoryList: Observable<Category[]> = this.categoryList.asObservable();

  private cardList: BehaviorSubject<ICard[]> = new BehaviorSubject<ICard[]>([]);
  public $cardList: Observable<ICard[]> = this.cardList.asObservable();

  private operationList: BehaviorSubject<Operation[]> = new BehaviorSubject<Operation[]>([]);
  public $operationList: Observable<Operation[]> = this.operationList.asObservable();

  public get colors() {
    return this.colorsArray;
  }

  public get categoryIcons() {
    return this.catIconsArray;
  }

  public get cardIcons() {
    return this.cardIconArray;
  }

  username: BehaviorSubject<string> = new BehaviorSubject<string>('');
  $username: Observable<string> = this.username.asObservable();

  userEmail: string = '';

  public moneyTypesList = this.userFBService.moneyTypeList;

  currentMoneyType:BehaviorSubject<MoneyType> = new BehaviorSubject<MoneyType>(this.userInfo.currentMoneyType);
  $currentMoneyType: Observable<MoneyType> = this.currentMoneyType.asObservable();

  public setUsername(newName: string): void {
    this.userFBService.userName = newName;
  }

  public setUserEmail(newEmail: string): void {
    this.userEmail = newEmail;
    this.userFBService.userEmail = newEmail;
  }

  public setCurrentMoneyType(newCurrentMoneyType: MoneyType): void {
    this.userFBService.userCurrencyMoneyType = newCurrentMoneyType;
  }

  public addNewCategory(name: string, colorIndex: number, iconIndex: number, type: CategoryType): void {
    if (this.categoryList.getValue().find(cat => cat.name === name)) {
      throw new Error('Категория с таким именем уже существует');
    }
    else {
      this.userFBService.addCategory({
        name: name,
        color: this.colorsArray[colorIndex],
        icon: this.catIconsArray[iconIndex],
        type: type
      });
    }
  }

  public removeCategory(category: ICategory) {
    this.userFBService.removeCategory(category);
  }

  public addNewCard(name: string, colorIndex: number, iconIndex: number): void {
    if(this.cardList.getValue().find(card => card.name === name)) {
      throw new Error('Карта с таким именем уже существует');
    }
    else {
      this.userFBService.addCard({
        name: name,
        color: this.colorsArray[colorIndex],
        icon: this.cardIconArray[iconIndex],
        amount: 0
      })
    }
  }

  public addOperation(category: ICategory, card: ICard, date: string, value: number) {
    this.userFBService.addOperation({
      card: card.name,
      date: date,
      value: value,
      categoryName: category.name,
      id: ''
    })
    this.userFBService.updateCardAmount(card, card.amount + value);
  }

  public updateOperation(category: ICategory, card: ICard, date: string, value: number, oldOperation: Operation) {
    this.userFBService.updateOperation({
      categoryName: category.name,
      card: card.name,
      date: date,
      value: value,
      id: oldOperation.id
    })
    this.userFBService.updateCardAmount(card, card.amount - oldOperation.value + value);
  }

  public deleteOperation(operation: Operation): void {
    this.userFBService.deleteOperation(operation);
    let card = this.cardList.getValue().find(card => card.name === operation.card);
    if (card) {
      this.userFBService.updateCardAmount(card, operation.value);
    }
  }
}
