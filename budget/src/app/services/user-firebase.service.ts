import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Category} from "../models/classes/category.model";
import {Operation} from "../models/classes/operation.model";
import {Card} from "../models/classes/card.model";
import {getAuth, onAuthStateChanged} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService {

  private userUID?: string;
  private userName: string = '';
  private userEmail: string = '';
  private userPath?: AngularFirestoreDocument;
  private categoryListPath?: AngularFirestoreCollection<Category>;
  private operationListPath?: AngularFirestoreCollection<Operation>;
  private cardListPath?: AngularFirestoreCollection<Card>;

  private isLoggedIn: boolean = false;

  public get LoggedStatus(): boolean {
    return this.isLoggedIn;
  }

  constructor(public dataBase: AngularFirestore) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Юзер тут");
        this.isLoggedIn = true;
        this.userUID = user.uid;
      }
      else {
        console.log("Юзер убежал");
        this.isLoggedIn = false;
        this.userUID = '';
      }
    })
  }

  /** Метод для создания путей в коллекции нынешнего пользователя */
  private createPaths() {
    this.userPath = this.dataBase.collection('users').doc(this.userUID);
    this.categoryListPath = this.userPath.collection('categoryList');
    this.operationListPath = this.userPath.collection('operationList');
    this.cardListPath = this.userPath.collection('cardList');
  }

  /** Создание нового пользователя и его полей в хранилище */
  createNewUser(email: string, name: string) {

    this.createPaths();

    this.userPath?.set({
      name: name,
      email: email
    });
  }

  /** Авторизация пользователя */
  signInUser() {

    this.createPaths();
  }
}
