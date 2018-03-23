import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//import { HeaderComponent } from '../header/header.component';
//import { LoginComponent } from '../login/login.component';
//import { PurchaseHistoryComponent } from '../purchase-history/purchase-history.component';
import { SignupComponent } from '../signup/signup.component';


import { UserService } from '../services/user.service';
import { ShoppingCartService } from '../services/shopping.cart.service';
import { isNotAuthGuard } from '../services/check.not.auth.service';

import { HeaderModule } from '../header/header.module';

const signupRoutes: Routes = [
    { path: 'signup', component: SignupComponent, canActivate: [isNotAuthGuard]},
  ]
  
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(signupRoutes),
        HeaderModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [SignupComponent],
    providers: [
        isNotAuthGuard,
        UserService,
        ShoppingCartService
    ],
    exports: [RouterModule]
})

export class SignupModule {
}