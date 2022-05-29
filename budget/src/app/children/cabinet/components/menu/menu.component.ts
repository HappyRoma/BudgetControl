import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private firebaseAuth: AngularFireAuth, private router: Router, private elRef: ElementRef) { }

  ngOnInit(): void {
    this.changeMarker(this.router.url);
  }

  changeMarker(pageName: string) {
    let markerClass = this.elRef.nativeElement.querySelector('.current-window-marker');

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

  public signOut() {
    this.firebaseAuth.signOut()
      .then(() => {
        console.log("Sign out success");
        this.router.navigate(['login']);
      })
      .catch(() => {
        console.log("Sign out error");
      });
  }

}
