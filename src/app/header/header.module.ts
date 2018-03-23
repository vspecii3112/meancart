import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './header.component';
//import { HomepageComponent } from '../homepage/homepage.component';
//import { LoginComponent } from '../login/login.component';
//import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
//import { SignupComponent } from '../signup/signup.component';
//import { ChangeUserPasswordComponent } from '../user-profile/change-user-password/change-user-password.component';

//import { LoginModule } from '../login/login.module';
//import { SignupModule } from '../signup/signup.module';

import { UserService } from '../services/user.service';
import { isAuthGuard } from '../services/check.auth.service';
import { isNotAuthGuard } from '../services/check.not.auth.service';

const headerRoutes: Routes = [
    //{ path: 'home', component: HomepageComponent},
    //{ path: 'login', component: LoginComponent, canActivate: [isNotAuthGuard]},
    //{ path: 'signup', component: SignupComponent, canActivate: [isNotAuthGuard]},
    //{ path: 'cart', component: ShoppingCartComponent},
    //{ path: 'change_user_password', component: ChangeUserPasswordComponent, canActivate: [isAuthGuard]}
    //{ path: '', redirectTo: '/home', pathMatch: 'full'}
  ]

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule.forChild(headerRoutes)
    ],
    declarations: [HeaderComponent],
    providers: [
        UserService,
        isAuthGuard,
        isNotAuthGuard
    ],
    exports: [
        HeaderComponent,
        RouterModule
    ]
})

export class HeaderModule {
}