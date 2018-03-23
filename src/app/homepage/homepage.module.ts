import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { HomepageComponent } from '../homepage/homepage.component';     //this is a container
import { HomepageIntroComponent } from './homepage-intro/homepage-intro.component';     //this is a presentation component
import { HomepageAboutComponent } from './homepage-about/homepage-about.component';     //this is a presentation component
import { HomepageShopComponent } from './homepage-shop/homepage-shop.component';        //this is a presentation component

import { ShoppingCartService } from '../services/shopping.cart.service';
import { LoadCoinInfoService } from '../services/load.coin.info.service';

import { HeaderModule } from '../header/header.module';

const homepageRoutes: Routes = [
    { path: 'home', component: HomepageComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full'}
  ]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(homepageRoutes),
        HeaderModule,
        HttpClientModule
    ],
    declarations: [HomepageComponent, HomepageIntroComponent, HomepageAboutComponent, HomepageShopComponent],
    providers: [
        LoadCoinInfoService,
        ShoppingCartService
    ]
})

export class HomepageModule {
}