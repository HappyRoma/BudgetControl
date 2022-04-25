import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {filter, map, Observable} from 'rxjs';
import {UserFirebaseService} from "../services/user-firebase.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServise: UserFirebaseService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    return this.authServise.IsDataLoaded.pipe(
      // @ts-ignore
      filter((value: boolean | null) => {
        return value !== null
      }),
      map((value: boolean) => {
        if (!value) {
          return this.router.createUrlTree(['login']);
        }

        return value;
      })
    )
  }

}
