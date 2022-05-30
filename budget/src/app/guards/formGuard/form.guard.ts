import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RegistrationComponent } from '../../children/account/components/registration/registration.component';

@Injectable({
    providedIn: 'root'
})
export class FormGuard implements CanDeactivate<RegistrationComponent> {
    public canDeactivate(
        component: RegistrationComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return !component.isFormDirty() || confirm('Ваши данные не были сохранены. Вы действительно хотите покинуть страницу?');
    }

}
