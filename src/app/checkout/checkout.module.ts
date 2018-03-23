import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//import { HeaderComponent } from '../header/header.component';
//import { HomepageComponent } from '../homepage/homepage.component';

import { CheckoutComponent } from '../checkout/checkout.component';
//import { OrderConfirmationComponent } from '../order-confirmation/order-confirmation.component';
import { CheckoutOrderdetailsComponent } from './checkout-orderdetails/checkout-orderdetails.component';
import { CheckoutItemsComponent } from './checkout-items/checkout-items.component';

import { UserService } from '../services/user.service';
import { isAuthGuard } from '../services/check.auth.service';

import { HeaderModule } from '../header/header.module';

const checkoutRoutes: Routes = [
    //{ path: 'home', component: HomepageComponent},
    //{ path: 'login', component: LoginComponent, canActivate: [isNotAuthGuard]},
    //{ path: 'signup', component: SignupComponent, canActivate: [isNotAuthGuard]},
    //{ path: 'purchase_history/order_details/:id', component: OrderDetailsComponent, canActivate: [isAuthGuard]},
    //{ path: 'purchase_history', component: PurchaseHistoryComponent, canActivate: [isAuthGuard]},
    //{ path: 'cart', component: ShoppingCartComponent},
    { path: 'checkout', component: CheckoutComponent, canActivate: [isAuthGuard]},
    //{ path: 'change_user_password', component: ChangeUserPasswordComponent, canActivate: [isAuthGuard]},
    //{ path: 'order_confirmation/:id', component: OrderConfirmationComponent, canActivate: [isAuthGuard]},
    //{ path: 'reset/:token', component: ResetPasswordComponent},
    //{ path: 'forgot', component: ForgotUserPasswordComponent, canActivate: [isNotAuthGuard]},
    //{ path: '', redirectTo: '/home', pathMatch: 'full'}
  ]
  
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(checkoutRoutes),
        HeaderModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
        CheckoutComponent,
        CheckoutOrderdetailsComponent,
        CheckoutItemsComponent
    ],
    providers: [
        UserService,
        isAuthGuard
    ],
    exports: [RouterModule]
})

export class CheckoutModule {
}