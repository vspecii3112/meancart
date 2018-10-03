import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgRedux } from '@angular-redux/store';
import { IAppState } from "../store/model";
import { HeaderComponent } from '../header/header.component';
import { CheckoutOrderdetailsComponent } from './checkout-orderdetails/checkout-orderdetails.component';
import { CheckoutItemsComponent } from './checkout-items/checkout-items.component';

import { ShoppingCartService } from '../services/shopping.cart.service';
import { currency } from '../objects/currency.class';
import { round } from '../modules/round.module';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit{

    private errorMsg: string = "";
  
    private cartItems: any = [];    //this array variable stores the shopping cart item objects
    private cartTotalPrice: number = 0; //this variable stores the total price of all the items in the shopping cart

    private total_qty: number = 0;    //stores the number of items in the variable and this number is shown beside the shopping cart link


    private currencySubscription: any;
    //private currencyRate: number = 1;
    private currency: currency = {
      currency: " USD",
      forex: "USD/USD",
      rate: 1
    };
  
    constructor (
      private shoppingcart: ShoppingCartService,
      private _router: Router,

      private ngRedux: NgRedux<IAppState>
    ) {}
  
    ngOnInit() {
      this.checkCart();
    }

    convertTotalPrice() {
      if (this.cartItems.length !== 0){
        if (this.currency.rate == 1 ){
          this.cartTotalPrice = 0;
          this.cartItems.map(x => {
            this.cartTotalPrice = this.cartTotalPrice + x.price;
          });
        }
        else {
          this.cartTotalPrice = 0;
          this.cartItems.map(x => {
            this.cartTotalPrice = this.cartTotalPrice + (round(x.item.price * this.currency.rate, 2) * x.qty);
          });
        }
      }
    }

    getCurrencyRate() {
      this.currencySubscription = this.ngRedux.select<any>()
      .subscribe(newCurrency => {
        //this.currencyRate = newCurrency.switchCurrencyReducer.currency.rate;
        this.currency = newCurrency.switchCurrencyReducer.currency;
        this.convertTotalPrice();    //converts the price using the selected currency
      });
    }

    checkCart() {
      this.shoppingcart.cartCheckout()
        .subscribe(
          data => {
            if (data.redirect=='home') {
              this._router.navigate(['/home']);
              console.log('no items in cart');
            }
            else if (data.redirect=='login'){
              this._router.navigate(['/login']);
            }
            else {
              this.cartItems=data.coins;
              //this.cartTotalPrice = data.totalPrice;
              this.getCurrencyRate()
              //console.log(this.cartItems);
            }
            this.total_qty = data.totalQuantity;
          },
          err => console.log(err),
          () => console.log('checkout done')
        )
    }
  
    stripeTokenHandler(token: any) {
      this.shoppingcart.makeCharge(token.id, this.currency)
      .subscribe(
        data => {
          if (data.success) {
            this._router.navigate(['/order_confirmation/'+ data.orderID]);
            console.log("charge success");
            //console.log(data.orderID);
          }
        },
        err => {
            console.log(err.error.msg);
            this.errorMsg = err.error.msg;
        },
        () => {console.log('Checkout complete');}
      )
    }

    ngOnDestroy() {                    // <- New
      if(this.currencySubscription){
        this.currencySubscription.unsubscribe();
      }
    }  
    
  }
