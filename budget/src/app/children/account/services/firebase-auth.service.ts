import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserFirebaseService } from '../../../services/user-firebase.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthService {

    public errorText: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public $errorText: Observable<string> = this.errorText.asObservable();

    constructor(private _firebaseAuth: AngularFireAuth, private _userAuth: UserFirebaseService) {
    }

    public setNewError(error: string): void {
        this.errorText.next(error);
    }

    async Signup(email: string, password: string, name: string) {
        await this._firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(() => {

                this.setNewError('');
                this._userAuth.createNewUser(email, name);

            })
            .catch((error) => {

                const errorCode = error.code;
                console.log(errorCode);
                this.setNewError(errorCode);

            });
    }

    async Signin(email: string, password: string) {
        await this._firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(() => {

                console.log('Done');
                this.setNewError('');
                this._userAuth.signInUser();

            })
            .catch((error) =>{

                const errorCode = error.code;
                console.log(errorCode);
                this.setNewError(errorCode);

            });
    }

    async SignOut() {
        await this._firebaseAuth.signOut()
            .then(() => {
                console.log('Sign out success');
            })
            .catch(() => {
                console.log('Sign out error');
            });
    }
}
