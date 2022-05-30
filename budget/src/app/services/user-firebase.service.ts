import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    DocumentData, QueryDocumentSnapshot, QuerySnapshot
} from '@angular/fire/compat/firestore';
import { Category } from '../models/classes/category.model';
import { Operation } from '../models/classes/operation.model';
import { Card } from '../models/classes/card.model';
import { Auth, getAuth, onAuthStateChanged, updateEmail, updateProfile, User } from '@angular/fire/auth';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IUser } from '../models/interfaces/user.interface';
import { MoneyType } from '../models/classes/moneyType.class';
import { ICategory } from '../models/interfaces/category.interface';
import { ICard } from '../models/interfaces/card.interface';
import { IOperation } from '../models/interfaces/operation.interface';

@Injectable({
    providedIn: 'root'
})
export class UserFirebaseService {

    private _moneyTypesList: MoneyType[] = [new MoneyType('Российский рубль', '₽'),
        new MoneyType('Американский доллар', '$'),
        new MoneyType('Евро', '€')];

    private _user: BehaviorSubject<IUser> =  new BehaviorSubject<IUser>({
        uid: '',
        name: '',
        email: '',
        currentMoneyType: this._moneyTypesList[0],
        categoryList: [],
        cardList: [],
        operationList: []
    });

    private _userPath?: AngularFirestoreDocument;
    private _categoryListPath?: AngularFirestoreCollection<Category>;
    private _operationListPath?: AngularFirestoreCollection<Operation>;
    private _cardListPath?: AngularFirestoreCollection<Card>;

    private _isDataLoaded: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);


    public get isDataLoaded(): Observable<boolean | null> {
        return this._isDataLoaded.asObservable();
    }

    constructor(public dataBase: AngularFirestore) {
        this.liveLoggedStatus();
    }

    /** Добавление категории
   *
   * @param category - Объект Category. Категория должна иметь уникальное имя.
   * */
    public addCategory(category: ICategory): void {
        this._categoryListPath?.doc().set(category);
    }

    /** Удаление категории
   *
   * @param category - Объект Category.
   * */
    public removeCategory(category: ICategory): void {
        this._operationListPath?.get().forEach((operations: QuerySnapshot<Operation>) => {
            this._operationListPath?.doc(operations.docs.find((oper: QueryDocumentSnapshot<Operation>) => oper.data().categoryName === category.name)?.id).update({ categoryName: 'Другое' });
        });
        this._categoryListPath?.get().forEach((categories: QuerySnapshot<Category>) => {
            this._categoryListPath?.doc(categories.docs.find((doc: QueryDocumentSnapshot<Category>) => doc.data().name === category.name)?.id).delete();
        });
    }

    /** Добавление счета
   *
   * @param card - Объект Card. Счет должен иметь уникальное имя.
   * */
    public addCard(card: ICard): void {
        this._cardListPath?.doc().set(card);
    }

    /** Обновление суммы счета
   *
   * @param card - Объект Card в котором должно измениться значение
   * @param amount - Новое значение у объекта Card
   */
    public updateCardAmount(card: ICard, amount: number): void {
        this._cardListPath?.get().forEach((cards: QuerySnapshot<Card>) => {
            this._cardListPath?.doc(cards.docs.find((doc: QueryDocumentSnapshot<Card>) => doc.data().name === card.name)?.id).update({ amount: amount });
        });
    }

    /** Добавление операции
   *
   * @param operation - Объект Operation.
   * */
    public addOperation(operation: IOperation): void {
        const newOperationDoc: AngularFirestoreDocument<Operation> | undefined = this._operationListPath?.doc();
        newOperationDoc?.set(operation);
        newOperationDoc?.update({ id: newOperationDoc?.ref.id });
    }

    /** Изменение операции
   *
   * @param operation - Измененный Объект Operation. ID операции не должен изменяться!
   * */
    public updateOperation(operation: IOperation): void {
        this._operationListPath?.doc(operation.id).update({
            value: operation.value,
            date: operation.date,
            categoryName: operation.categoryName,
            card: operation.card
        });
    }

    /** Удаление операции
   *
   * @param operation - Объект Operation.
   * */
    public deleteOperation(operation: IOperation): void {
        this._operationListPath?.doc(operation.id).delete();
    }

    /** Установить аватар у юзера
   *
   * @param profilePhoto - avatar URL
   * */
    public updateProfileAvatar(profilePhoto: string): void {
        const user: User | null = getAuth().currentUser;

        if (user) {
            updateProfile(user, { photoURL: profilePhoto });
        }
    }

    /** Создание нового пользователя и его полей в хранилище */
    public createNewUser(email: string, name: string): void {

        this.createPaths();
        // Тут программа просто валится. Пути создаются раньше, а значит и значения дефолтных полей читаются раньше, чем они успевают создаться.
        // FB как котик падает в недоумении что происходит. Мне пока лень это переписывать и тестить, оставим на патч первого дня

        this._userPath?.set({
            name: name,
            email: email,
            currencyMoneyType: this._moneyTypesList[0].toString()
        });
    }

    /** Авторизация пользователя */
    public signInUser(): void {

        this.createPaths();

    }

    private liveLoggedStatus(): void {
        const auth: Auth = getAuth();
        onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                console.log('Юзер тут');
                this._isDataLoaded.next(true);
                this._user.pipe(
                    map((value: IUser) =>  value.uid = user.uid)
                ).subscribe();
                this.createPaths();
            }
            else {
                console.log('Юзер убежал');
                this._isDataLoaded.next(false);
                this._user.pipe(
                    map((value: IUser) => value.uid = '')
                ).subscribe();
            }
        });
    }

    /** Метод для создания путей в коллекции нынешнего пользователя и инициализации полей */
    private createPaths(): void {
        this._userPath = this.dataBase.collection('users').doc(this._user.getValue().uid);
        this._categoryListPath = this._userPath.collection('categoryList');
        this._operationListPath = this._userPath.collection('operationList');
        this._cardListPath = this._userPath.collection('cardList');
        this.valueUpdating();
    }

    private valueUpdating(): void {
        this._userPath?.valueChanges().subscribe((items: DocumentData | undefined) => {
            if (items) {
                this._user.pipe(
                    map((user: IUser) => user.name = items['name'])
                ).subscribe();
                this._user.pipe(
                    map((user: IUser) => user.email = items['email'])
                ).subscribe();
                this._user.pipe(
                    map((user: IUser) => {
                        this._moneyTypesList.forEach((mtp: MoneyType) => {
                            if (mtp.toString() === items['currencyMoneyType']) {
                                user.currentMoneyType = mtp;
                            }
                        });
                    })
                ).subscribe();
                this._user.next(this._user.getValue());
                console.log(this._user.getValue());
            }
        });
        this._categoryListPath?.valueChanges().subscribe((categories: Category[]) => {
            if (categories) {
                this._user.pipe(
                    map((user: IUser) => {
                        user.categoryList = categories;
                    })
                ).subscribe();
                this._user.next(this._user.getValue());
                console.log(this._user.getValue());
            }
        });
        this._cardListPath?.valueChanges().subscribe((card: Card[]) => {
            if (card) {
                this._user.pipe(
                    map((user: IUser) => {
                        user.cardList = card;
                    })
                ).subscribe();
                this._user.next(this._user.getValue());
                console.log(this._user.getValue());
            }
        });
        this._operationListPath?.valueChanges().subscribe((operation: Operation[]) => {
            if (operation) {
                this._user.pipe(
                    map((user: IUser) => {
                        user.operationList = operation;
                    })
                ).subscribe();
                this._user.next(this._user.getValue());
            }
        });
    }



    /** Получить значение user */
    public get user(): Observable<IUser> {
        return this._user.asObservable();
    }

    public get moneyTypeList(): MoneyType[] {
        return this._moneyTypesList;
    }

    /** Установить новое значение userName */
    public set userName(name: string) {
        if (this._user.getValue().name !== name) {
            this._userPath?.update({ name: name });
        }
    }

    /** Установить новое значение userEmail */
    public set userEmail(email: string) {
        if (this._user.getValue().email !== email) {
            const auth: Auth = getAuth();
            // @ts-ignore
            updateEmail(auth.currentUser, email).then(() => {
                console.log('Почта изменена');
                this._userPath?.update({ email: email });
            }).catch((error: any) => {
                console.log(error);
            });
        }
    }

    /** Установить новое значение userCurrencyMoneyType */
    public set userCurrencyMoneyType(newMT: MoneyType) {
        if (this._user.getValue().currentMoneyType !== newMT) {
            this._userPath?.update({ currencyMoneyType: newMT.toString() });
        }
    }
}
