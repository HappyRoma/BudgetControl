import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MoneyType } from '../../../../models/classes/moneyType.class';
import { UserFirebaseService } from '../../../../services/user-firebase.service';
import { IUser } from '../../../../models/interfaces/user.interface';
import { User } from '../../../../models/classes/user.model';
import { CategoryType, ICategory } from '../../../../models/interfaces/category.interface';
import { ICard } from '../../../../models/interfaces/card.interface';
import { Category } from '../../../../models/classes/category.model';
import { Operation } from '../../../../models/classes/operation.model';



@Injectable({
    providedIn: 'root'
})
export class LogService {

    public userInfo: IUser = new User();

    public username: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public $username: Observable<string> = this.username.asObservable();

    public userEmail: string = '';

    public moneyTypesList: MoneyType[] = this._userFBService.moneyTypeList;

    public currentMoneyType: BehaviorSubject<MoneyType> = new BehaviorSubject<MoneyType>(this.userInfo.currentMoneyType);
    public $currentMoneyType: Observable<MoneyType> = this.currentMoneyType.asObservable();

    public differentCategory: BehaviorSubject<Category> = new BehaviorSubject<Category>({
        name: 'Другое',
        color: 'grey',
        icon: '',
        type: 'expend',
        operationList: []
    });
    public differentCategory$: Observable<Category> = this.differentCategory.asObservable();

    public categoryList: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
    public $categoryList: Observable<Category[]> = this.categoryList.asObservable();

    private _cardList: BehaviorSubject<ICard[]> = new BehaviorSubject<ICard[]>([]);
    public $cardList: Observable<ICard[]> = this._cardList.asObservable();

    private _operationList: BehaviorSubject<Operation[]> = new BehaviorSubject<Operation[]>([]);
    public $operationList: Observable<Operation[]> = this._operationList.asObservable();

    private _colorsArray: string[] = [
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

    private _catIconsArray: string[] = [
        'url("assets/icons/category-icons/shoppingBag.svg")',
        'url("assets/icons/category-icons/health.svg")',
        'url("assets/icons/category-icons/gift.svg")',
        'url("assets/icons/category-icons/food.svg")',
        'url("assets/icons/category-icons/film.svg")',
        'url("assets/icons/category-icons/family.svg")',
        'url("assets/icons/category-icons/bus.svg")',
        'url("assets/icons/category-icons/basket.svg")'
    ];

    private _cardIconArray: string[] = [
        'url("assets/icons/card-icons/bank.svg")',
        'url("assets/icons/card-icons/coin.svg")',
        'url("assets/icons/card-icons/credit-card.svg")',
        'url("assets/icons/card-icons/piggy-bank.svg")',
        'url("assets/icons/card-icons/wallet.svg")',
    ];

    constructor(private _userFBService: UserFirebaseService) {
        this._userFBService.user.subscribe((user: IUser) => {
            this.userInfo = user;
            this.username.next(user.name);
            this.userEmail = user.email;
            this.currentMoneyType.next(user.currentMoneyType);
            this._operationList.next(user.operationList);
            this.categoryList.next(user.categoryList);
            this.setOperationsToCategoryList();
            this._cardList.next(user.cardList);
        });
    }

    public get colors(): string[] {
        return this._colorsArray;
    }

    public get categoryIcons(): string[] {
        return this._catIconsArray;
    }

    public get cardIcons(): string[] {
        return this._cardIconArray;
    }

    public setUsername(newName: string): void {
        this._userFBService.userName = newName;
    }

    public setUserEmail(newEmail: string): void {
        this.userEmail = newEmail;
        this._userFBService.userEmail = newEmail;
    }

    public setCurrentMoneyType(newCurrentMoneyType: MoneyType): void {
        this._userFBService.userCurrencyMoneyType = newCurrentMoneyType;
    }

    public addNewCategory(name: string, colorIndex: number, iconIndex: number, type: CategoryType): void {
        if (this.categoryList.getValue().find((cat: Category) => cat.name === name)) {
            throw new Error('Категория с таким именем уже существует');
        }
        else {
            this._userFBService.addCategory({
                name: name,
                color: this._colorsArray[colorIndex],
                icon: this._catIconsArray[iconIndex],
                type: type
            });
        }
    }

    public removeCategory(category: ICategory): void {
        this._userFBService.removeCategory(category);
    }

    public addNewCard(name: string, colorIndex: number, iconIndex: number): void {
        if(this._cardList.getValue().find((card: ICard) => card.name === name)) {
            throw new Error('Карта с таким именем уже существует');
        }
        else {
            this._userFBService.addCard({
                name: name,
                color: this._colorsArray[colorIndex],
                icon: this._cardIconArray[iconIndex],
                amount: 0
            });
        }
    }

    public addOperation(category: ICategory, card: ICard, date: string, value: number): void {
        this._userFBService.addOperation({
            card: card.name,
            date: date,
            value: value,
            categoryName: category.name,
            id: ''
        });
        this._userFBService.updateCardAmount(card, card.amount + value);
    }

    public updateOperation(category: ICategory, card: ICard, date: string, value: number, oldOperation: Operation): void {
        this._userFBService.updateOperation({
            categoryName: category.name,
            card: card.name,
            date: date,
            value: value,
            id: oldOperation.id
        });
        this._userFBService.updateCardAmount(card, card.amount - oldOperation.value + value);
    }

    public deleteOperation(operation: Operation): void {
        this._userFBService.deleteOperation(operation);
        const card: ICard | undefined = this._cardList.getValue().find((c: ICard) => c.name === operation.card);
        if (card) {
            this._userFBService.updateCardAmount(card, card.amount - operation.value);
        }
    }

    private setOperationsToCategoryList(): void {
        this.categoryList.subscribe((category: Category[]) => {
            category.forEach((cat: Category) => cat.operationList = []);
        });
        this.differentCategory.subscribe((category: Category) => category.operationList = []);
        this._operationList.getValue().forEach((operation: Operation) => {
            if (operation.categoryName === 'Другое') {
                this.differentCategory.pipe(
                    map((cat: Category) => {
                        cat.operationList?.push(operation);
                    })
                ).subscribe();
            }
            else {
                this.categoryList.subscribe((category: Category[]) => {
                    category.find((cat: Category) => cat.name === operation.categoryName)?.operationList?.push(operation);
                });
            }
        });
    }
}
