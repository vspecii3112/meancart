import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
//import { HttpClientModule } from '@angular/common/http';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderModule } from './header/header.module';
import { LoginModule } from './login/login.module';
import { HomepageModule } from './homepage/homepage.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { SignupModule } from './signup/signup.module';
import { StoreModule } from "./store/module";
import { CheckoutModule } from './checkout/checkout.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { PurchaseHistoryModule } from './purchase-history/purchase-history.module';
import { OrderConfirmationModule } from './order-confirmation/order-confirmation.module';
import { UserProfileModule } from './user-profile/user-profile.module';

import { AppComponent } from './app.component';
//import { ChangeUserPasswordComponent } from './change-user-password/change-user-password.component';
//import { CheckoutComponent } from './checkout/checkout.component';
//import { HeaderComponent } from './header/header.component';
//import { HomepageComponent } from './homepage/homepage.component';
//import { LoginComponent } from './login/login.component';
//import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
//import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
//import { SignupComponent } from './signup/signup.component';
//import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
//import { OrderDetailsComponent } from './order-details/order-details.component';
//import { ForgotUserPasswordComponent } from './forgot-user-password/forgot-user-password.component';
//import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

//import { UserService } from './services/user.service';
//import { ShoppingCartService } from './services/shopping.cart.service';
//import { LoadCoinInfoService } from './services/load.coin.info.service';
//import { isAuthGuard } from './services/check.auth.service';
//import { isNotAuthGuard } from './services/check.not.auth.service';



const appRoutes: Routes = [
  //{ path: 'home', component: HomepageComponent},
  //{ path: 'login', component: LoginComponent, canActivate: [isNotAuthGuard]},
  //{ path: 'signup', component: SignupComponent, canActivate: [isNotAuthGuard]},
  //{ path: 'purchase_history/order_details/:id', component: OrderDetailsComponent, canActivate: [isAuthGuard]},
  //{ path: 'purchase_history', component: PurchaseHistoryComponent, canActivate: [isAuthGuard]},
  //{ path: 'cart', component: ShoppingCartComponent},
  //{ path: 'checkout', component: CheckoutComponent, canActivate: [isAuthGuard]},
  //{ path: 'change_user_password', component: ChangeUserPasswordComponent, canActivate: [isAuthGuard]},
  //{ path: 'order_confirmation/:id', component: OrderConfirmationComponent, canActivate: [isAuthGuard]},
  //{ path: 'reset/:token', component: ResetPasswordComponent},
  //{ path: 'forgot', component: ForgotUserPasswordComponent, canActivate: [isNotAuthGuard]},
  //{ path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    //ChangeUserPasswordComponent,
    //CheckoutComponent,
    //HeaderComponent,
    //HomepageComponent,
    //LoginComponent,
    //PurchaseHistoryComponent,
    //ShoppingCartComponent,
    //SignupComponent,
    //OrderConfirmationComponent,
    //OrderDetailsComponent,
    //ForgotUserPasswordComponent,
    //ResetPasswordComponent,
    FooterComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    //FormsModule,
    //ReactiveFormsModule,
    //HttpClientModule,
    StoreModule,
    HeaderModule,
    LoginModule,
    HomepageModule,
    ShoppingCartModule,
    SignupModule,
    CheckoutModule,
    PasswordResetModule,
    PurchaseHistoryModule,
    OrderConfirmationModule,
    UserProfileModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    //UserService,
    //ShoppingCartService,
    //LoadCoinInfoService,
    //isAuthGuard,
    //isNotAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
