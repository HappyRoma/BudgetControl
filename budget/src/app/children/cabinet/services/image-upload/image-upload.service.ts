import { Injectable } from '@angular/core';
import {getDownloadURL, ref, uploadBytes} from "@angular/fire/storage";
import {map, from, switchMap} from "rxjs";
import {UserFirebaseService} from "../../../../services/user-firebase.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private userUID: string = '';

  constructor(private storage: AngularFireStorage, private userFBService: UserFirebaseService) {
    this.userFBService.user.subscribe(user => {
      this.userUID = user.uid;
    })
  }

  uploadImage(image: File): void {
    const storageRef = ref(this.storage.storage, `images/profile/${this.userUID}`);
    const uploadTask = from(uploadBytes(storageRef, image));

    uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref)),
      map((photoURL) => this.userFBService.updateProfileAvatar(photoURL))
    ).subscribe()
  }
}
