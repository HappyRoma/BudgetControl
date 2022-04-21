import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {BehaviorSubject, Observable} from "rxjs";
import {UserFirebaseService} from "../../../services/user-firebase.service";

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  errorText: BehaviorSubject<string> = new BehaviorSubject<string>('');
  $errorText: Observable<string> = this.errorText.asObservable();

  public setNewError(error: string): void {
    this.errorText.next(error);
  }

  constructor(public firebaseAuth: AngularFireAuth, private userAuth: UserFirebaseService) {
  }

  async Signup(email: string, password: string, name: string) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(() => {

        this.setNewError('');
        this.userAuth.createNewUser(email, name);

      })
      .catch((error) => {

        let errorCode = error.code;
        console.log(errorCode);
        this.setNewError(errorCode);

      })
  }

  async Signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(() => {

        console.log("Done");
        this.setNewError('');
        this.userAuth.signInUser();

      })
      .catch((error) =>{

        let errorCode = error.code;
        console.log(errorCode);
        this.setNewError(errorCode);

      })
  }

  async SignOut() {
    await this.firebaseAuth.signOut()
      .then(() => {
        console.log("Sign out success");
      })
      .catch(() => {
        console.log("Sign out error");
      });
  }
}
