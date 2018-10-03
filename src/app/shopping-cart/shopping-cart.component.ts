import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from "../store/model";
import { HeaderComponent } from '../header/header.component';
import { ShoppingCartService } from '../services/shopping.cart.service';
import { currency } from '../objects/currency.class';
import { round } from '../modules/round.module';
import { generateArray } from "../modules/array.module";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {


  public cartItems: any = [];    //this array variable stores the shopping cart item objects
  public qtyMsg: any = [];
  public cartTotalPrice: number = 0; //this variable stores the total price of all the items in the shopping cart
  public total_qty: number = 0;  // this variable stores the total quantity
  public formCheck: any;

  public currencySubscription: any;

  public currency: currency = {
    currency: " USD",
    forex: "USD/USD",
    rate: 1
  };
  public testData: any = "";

  constructor(
    public shoppingcart: ShoppingCartService,
    //private _router: Router,

    public ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit() {
    this.shoppingCartItems();
  }
  
  getCurrencyRate() {
    this.currencySubscription = this.ngRedux.select<any>()
    .subscribe(newCurrency => {
      //this.currencyRate = newCurrency.switchCurrencyReducer.currency.rate;
      this.currency = newCurrency.switchCurrencyReducer.currency;
      if (this.cartItems.length > 0){
        if (this.currency.rate == 1 ){
          this.cartTotalPrice = 0;
          this.cartItems.map(x => {
            this.cartTotalPrice = this.cartTotalPrice + (round(x.price, 2));
          });
        }
        else {
          this.cartTotalPrice = 0;
          this.cartItems.map(x => {
            this.cartTotalPrice = this.cartTotalPrice + (round(x.item.price * this.currency.rate, 2) * x.qty);
          });
        }
      }
    });
  }

  shoppingCartItems() {
    this.shoppingcart.getCartItems()    //getCartItems observable gets the shopping cart items and stores it into the cartItems array
      .subscribe(
        data => {
          //console.log(data);
          if(data.cart) {
            this.total_qty = data.cart.totalQty;  //total quantity of items in the shopping cart
            this.cartItems = generateArray(data.cart.items);
            //console.log(this.cartItems);
            this.getCurrencyRate();
          } 
        },
        err => console.log(err),
        () => console.log('Get Cart Items Complete')
      )
  }

  calculateTotalPrice(cartFormArray: any) {
    let totalPrice:number = 0;
    cartFormArray.map(x=> {
      totalPrice = totalPrice + (round(x.productPrice * this.currency.rate, 2) * x.productQuantity);
    });
    return totalPrice;
  }

  updateCart(cartFormArray: any) {
    //console.log(cartFormArray);
    this.cartTotalPrice = this.calculateTotalPrice(cartFormArray);
    //console.log("before");
    //console.log(this.cartItems);
    cartFormArray.map( (x, i) => {
      this.cartItems[i].qty = x.productQuantity;
      this.cartItems[i].price = x.productQuantity * x.productPrice;
    });

    //console.log("after");
    //console.log(this.cartItems);
    this.updateCartSession(this.cartItems);
  }

  updateCartSession(cartItems: any) {
    this.shoppingcart.updateCart(cartItems)
    .subscribe(
      data => {
        //console.log(data);
        this.total_qty = data.totalQuantity;
      },
      err => console.log(err),
      () => console.log('Update cart complete')
    )
  }

  // unsubscribe observables
  ngOnDestroy() {
    if(this.currencySubscription){
      this.currencySubscription.unsubscribe();
    }
  }   

}
