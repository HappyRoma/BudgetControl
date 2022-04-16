import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TuiRootModule, TuiDialogModule } from "@taiga-ui/core";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LogService} from "./services/log.service";
import {CabinetModule} from "./children/cabinet/cabinet.module";
import {environment} from "../environments/environment";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiRootModule,
    BrowserAnimationsModule,
    TuiDialogModule,
    CabinetModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
  ],
  providers: [LogService],
  bootstrap: [AppComponent]
})

export class AppModule {}
