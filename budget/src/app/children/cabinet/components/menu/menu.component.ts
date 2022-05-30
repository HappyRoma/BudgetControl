import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    constructor(private _firebaseAuth: AngularFireAuth, private _router: Router, private _elRef: ElementRef) { }

    public ngOnInit(): void {
        this.changeMarker(this._router.url);
    }

    public changeMarker(pageName: string): void {
        const markerClass: any = this._elRef.nativeElement.querySelector('.current-window-marker');

        switch (pageName) {
            case '/cabinet/home':
                markerClass.style.setProperty('top', '214px');
                break;
            case '/cabinet/categories':
                markerClass.style.setProperty('top', '278px');
                break;
            case '/cabinet/cards':
                markerClass.style.setProperty('top', '342px');
                break;
            case '/cabinet/statistic':
                markerClass.style.setProperty('top', '406px');
                break;
            case '/cabinet/settings':
                markerClass.style.setProperty('top', '470px');
                break;
        }
    }

    public signOut(): void {
        this._firebaseAuth.signOut()
            .then(() => {
                console.log('Sign out success');
                this._router.navigate(['login']);
            })
            .catch(() => {
                console.log('Sign out error');
            });
    }

}
