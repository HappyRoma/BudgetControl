import { Injectable } from '@angular/core';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { map, from, switchMap } from 'rxjs';
import { UserFirebaseService } from '../../../../services/user-firebase.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { IUser } from '../../../../models/interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class ImageUploadService {

    private _userUID: string = '';

    constructor(private _storage: AngularFireStorage, private _userFBService: UserFirebaseService) {
        this._userFBService.user.subscribe((user: IUser) => {
            this._userUID = user.uid;
        });
    }

    public uploadImage(image: File): void {
        const storageRef = ref(this._storage.storage, `images/profile/${this._userUID}`);
        const uploadTask = from(uploadBytes(storageRef, image));

        uploadTask.pipe(
            switchMap((result) => getDownloadURL(result.ref)),
            map((photoURL: string) => this._userFBService.updateProfileAvatar(photoURL))
        ).subscribe();
    }
}
