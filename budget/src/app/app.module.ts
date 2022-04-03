import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TuiRootModule, TuiDialogModule, TuiNotificationsModule } from "@taiga-ui/core";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import {
  TuiDataListWrapperModule,
  TuiFieldErrorModule,
  TuiInputModule,
  TuiIslandModule,
  TuiSelectModule
} from "@taiga-ui/kit";
import {ReactiveFormsModule} from "@angular/forms";
import {LogService} from "./log.service";
import { AsideComponent } from './components/aside/aside.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    SettingsComponent,
    AsideComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiRootModule,
    BrowserAnimationsModule,
    TuiDialogModule,
    TuiNotificationsModule,
    TuiInputModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    ReactiveFormsModule,
    TuiFieldErrorModule,
    TuiIslandModule
  ],
  providers: [LogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
