import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

//import { HeaderComponent } from '../header/header.component';
//import { HomepageComponent } from '../homepage/homepage.component';
//import { LoginComponent } from '../login/login.component';
//import { PurchaseHistoryComponent } from '../purchase-history/purchase-history.component';
//import { SignupComponent } from '../signup/signup.component';
//import { ChangeUserPasswordComponent } from '../change-user-password/change-user-password.component';
//import { OrderDetailsComponent } from '../order-details/order-details.component';
//import { CheckoutComponent } from '../checkout/checkout.component';
import { OrderConfirmationComponent } from '../order-confirmation/order-confirmation.component';
//import { InvoiceDetailsShippingaddressComponent } from '../invoice/invoice-details-shippingaddress/invoice-details-shippingaddress.component';
//import { InvoiceDetailsProductsComponent } from '../invoice/invoice-details-products/invoice-details-products.component';
//import { InvoiceDetailsTotalComponent } from '../invoice/invoice-details-total/invoice-details-total.component';

//import { ForgotUserPasswordComponent } from '../password-reset/forgot-user-password/forgot-user-password.component';

import { UserService } from '../services/user.service';
import { ShoppingCartService } from '../services/shopping.cart.service';
import { isAuthGuard } from '../services/check.auth.service';

import { HeaderModule } from '../header/header.module';
import { InvoiceModule } from '../invoice/invoice.module';

const orderConfirmationRoutes: Routes = [
    //{ path: 'home', component: HomepageComponent},
    //{ path: 'login', component: LoginComponent, canActivate: [isNotAuthGuard]},
    //{ path: 'signup', component: SignupComponent, canActivate: [isNotAuthGuard]},
    //{ path: 'purchase_history/order_details/:id', component: OrderDetailsComponent, canActivate: [isAuthGuard]},
    //{ path: 'purchase_history', component: PurchaseHistoryComponent, canActivate: [isAuthGuard]},
    //{ path: 'cart', component: ShoppingCartComponent},
    //{ path: 'checkout', component: CheckoutComponent, canActivate: [isAuthGuard]},
    //{ path: 'change_user_password', component: ChangeUserPasswordComponent, canActivate: [isAuthGuard]},
    { path: 'order_confirmation/:id', component: OrderConfirmationComponent, canActivate: [isAuthGuard]},
    //{ path: 'reset/:token', component: ResetPasswordComponent},
    //{ path: 'forgot', component: ForgotUserPasswordComponent, canActivate: [isNotAuthGuard]},
    //{ path: '', redirectTo: '/home', pathMatch: 'full'}
  ]
  
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(orderConfirmationRoutes),
        HeaderModule,
        InvoiceModule,
        HttpClientModule
    ],
    declarations: [
        OrderConfirmationComponent
    ],
    providers: [
        UserService,
        ShoppingCartService,
        isAuthGuard
    ],
    exports: [RouterModule]
})

export class OrderConfirmationModule {
}