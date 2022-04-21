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
import {TuiRootModule} from "@taiga-ui/core";
import {LogService} from "./services/log.service";

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
    TuiRootModule,
  ],
  providers: [LogService]
})
export class CabinetModule { }
