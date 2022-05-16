import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
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
