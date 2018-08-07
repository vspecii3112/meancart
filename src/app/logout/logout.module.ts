import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
//import { HttpClientModule } from '@angular/common/http';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LogoutComponent } from './logout.component';

import { ShoppingCartService } from '../services/shopping.cart.service';
import { isNotAuthGuard } from '../services/check.not.auth.service';
import { HeaderModule } from '../header/header.module';

const logoutRoutes: Routes = [
    { path: 'logout', component: LogoutComponent, canActivate: [isNotAuthGuard]}
  ]
  
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(logoutRoutes),
        HeaderModule
    ],
    declarations: [LogoutComponent],
    providers: [
        isNotAuthGuard,
        ShoppingCartService
    ],
    exports: [RouterModule]
})

export class LogoutModule {
}