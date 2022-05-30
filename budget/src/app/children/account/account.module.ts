import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountLayoutComponent } from './pages/account-layout/account-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { FormGuard } from '../../guards/formGuard/form.guard';

const routes: Routes = [
    {
        path: '',
        component: AccountLayoutComponent,
        children: [
            {
                path: 'sign-in',
                component: SignInComponent,
            },
            {
                path: 'registration',
                component: RegistrationComponent,
                canDeactivate: [FormGuard],
            },
            {
                path: '**',
                redirectTo: 'sign-in'
            }
        ]
    },
];

@NgModule({
    declarations: [
        AccountLayoutComponent,
        SignInComponent,
        RegistrationComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    providers: [FirebaseAuthService]
})
export class AccountModule { }
