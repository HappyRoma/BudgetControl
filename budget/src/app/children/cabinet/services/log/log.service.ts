import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import { MoneyType } from '../../../../models/classes/moneyType.class';
import {UserFirebaseService} from "../../../../services/user-firebase.service";
import {IUser} from "../../../../models/interfaces/user.interface";
import {User} from "../../../../models/classes/user.model";



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
    });
  }

  username: BehaviorSubject<string> = new BehaviorSubject<string>('');
  $username: Observable<string> = this.username.asObservable();

  userEmail: string = '';

  public moneyTypesList = this.userFBService.moneyTypeList;

  currentMoneyType:BehaviorSubject<MoneyType> = new BehaviorSubject<MoneyType>(this.userInfo.currentMoneyType);
  $currentMoneyType: Observable<MoneyType> = this.currentMoneyType.asObservable();

  setUsername(newName: string): void {
    this.userFBService.userName = newName;
  }

  setUserEmail(newEmail: string): void {
    this.userEmail = newEmail;
    this.userFBService.userEmail = newEmail;
  }

  setCurrentMoneyType(newCurrentMoneyType: MoneyType): void {
    this.userFBService.userCurrencyMoneyType = newCurrentMoneyType;
  }
}
