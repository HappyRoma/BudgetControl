import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: 'cabinet',
    loadChildren: () => import('./children/cabinet/cabinet.module').then(module => module.CabinetModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./children/account/account.module').then(module => module.AccountModule),
  },
  {
    path: '**',
    redirectTo: 'cabinet'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
