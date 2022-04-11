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
    TuiIslandModule,
    TuiSelectModule
} from "@taiga-ui/kit";
import {ReactiveFormsModule} from "@angular/forms";
import {LogService} from "./log.service";
import { AsideComponent } from './components/aside/aside.component';
import {TuiAxesModule, TuiBarChartModule, TuiRingChartModule} from "@taiga-ui/addon-charts";
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { CategoriesComponent } from './components/categories/categories.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

const notifierDefaultOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12,
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: false,
    stacking: 5,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 400,
      easing: 'ease',
    },
    hide: {
      preset: 'slide',
      speed: 500,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    SettingsComponent,
    AsideComponent,
    CustomCurrencyPipe,
    CategoriesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiRootModule,
    BrowserAnimationsModule,
    TuiDialogModule,
    TuiNotificationsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    ReactiveFormsModule,
    TuiFieldErrorModule,
    TuiIslandModule,
    TuiRingChartModule,
    TuiAxesModule,
    TuiBarChartModule,
    NotifierModule.withConfig(notifierDefaultOptions)
  ],
  providers: [LogService],
  bootstrap: [AppComponent]
})

export class AppModule {}
