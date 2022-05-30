import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { UserFirebaseService } from '../services/user-firebase.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private _authService: UserFirebaseService, private _router: Router) {
    }

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


        return this._authService.isDataLoaded.pipe(
            // @ts-ignore
            filter((value: boolean | null) => {
                return value !== null;
            }),
            map((value: boolean) => {
                if (!value) {
                    return this._router.createUrlTree(['login']);
                }

                return value;
            })
        );
    }

}
