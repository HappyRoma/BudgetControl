import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {SettingsComponent} from "./components/settings/settings.component";
import {CategoriesComponent} from "./components/categories/categories.component";
import { CabinetLayoutComponent } from './pages/cabinet-layout/cabinet-layout.component';
import {MenuComponent} from "./components/menu/menu.component";
import {AsideComponent} from "./components/aside/aside.component";
import {CustomCurrencyComponent} from "./components/custom-currency/custom-currency.component";
import {TuiDataListWrapperModule, TuiFieldErrorModule, TuiIslandModule, TuiSelectModule} from "@taiga-ui/kit";
import {ReactiveFormsModule} from "@angular/forms";
import {TuiAxesModule, TuiBarChartModule, TuiRingChartModule} from "@taiga-ui/addon-charts";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {TuiRootModule} from "@taiga-ui/core";

const routes: Routes = [
  {
    path: '',
    component: CabinetLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      }
    ]
  }
]

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
    CabinetLayoutComponent,
    MenuComponent,
    HomeComponent,
    SettingsComponent,
    AsideComponent,
    CategoriesComponent,
    CustomCurrencyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    TuiSelectModule,
    TuiDataListWrapperModule,
    ReactiveFormsModule,
    TuiFieldErrorModule,
    TuiIslandModule,
    TuiRingChartModule,
    TuiAxesModule,
    TuiBarChartModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    TuiRootModule,
  ]
})
export class CabinetModule { }
