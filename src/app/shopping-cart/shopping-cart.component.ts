import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from "../store/model";
import { HeaderComponent } from '../header/header.component';
import { ShoppingCartService } from '../services/shopping.cart.service';
import { currency } from '../objects/currency.class';
import { round } from '../modules/round.module';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  private updateCartForm: FormGroup; //our form model
  private cartItems: any = [];    //this array variable stores the shopping cart item objects
  private qtyMsg: any = [];
  private cartTotalPrice: number = 0; //this variable stores the total price of all the items in the shopping cart
  private total_qty: number = 0;  // this variable stores the total quantity
  private updateCartSubscription: any;
  private currencySubscription: any;
  //private currencyRate: number = 1;
  private currency: currency = {
    currency: " USD",
    forex: "USD/USD",
    rate: 1
  };

  constructor(
    private shoppingcart: ShoppingCartService,
    private _router: Router,
    private _fb: FormBuilder,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit() {

    //initialize the form
    this.updateCartForm = this._fb.group({
      carts: this._fb.array([
        this.initCartForm(),
      ])
    });
    //this.getCurrencyRate();
    //this.shoppingCartItems();
    this.formUpdateEvent();
  }

  formUpdateEvent() {
    this.updateCartSubscription = this.updateCartForm.valueChanges
    .debounceTime(500)
    .distinctUntilChanged()
    .subscribe(data => {
      var valid: boolean = true;
      var totalPrice: number = 0;
      this.qtyMsg = [];

      //this will automatically update the total price and the store session
      for(let i=0; i<data.carts.length; i++) {
        //checks if the quantity value is valid
        if (Number(data.carts[i].productQuantity) < 1 || !Number.isInteger(Number(data.carts[i].productQuantity))) {
          this.qtyMsg[i] = "invalid input";
          valid = false;
        }
        totalPrice = totalPrice + (round(data.carts[i].productPrice * this.currency.rate, 2) * data.carts[i].productQuantity);
      }
      //console.log(this.updateCartForm);
      //console.log(data);
      if (valid) {
        this.cartTotalPrice = totalPrice;
        //console.log(this.cartTotalPrice);
        if (this.total_qty > 0) {
          this.updateCart(data);
        }
      }
    });
  }
  //This function is for display purposes to show the price with 2 decimal places
  coinPrice(price: number, qty: number = 1): string {
    //console.log(this.round(33 * 1.287168 * 2, 2));
    return (round(price * this.currency.rate, 2) * qty).toFixed(2);
  }

  coinPriceDisplay(price: number): string {
    return price.toFixed(2);
  }
  
  getCurrencyRate() {
    this.currencySubscription = this.ngRedux.select<any>()
    .subscribe(newCurrency => {
      //this.currencyRate = newCurrency.switchCurrencyReducer.currency.rate;
      this.currency = newCurrency.switchCurrencyReducer.currency;
      if (this.cartItems.length !== 0){
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
      //console.log(this.cartTotalPrice);
      //console.log(this.currency.rate);
      //console.log(this.cartItems);
    });
  }
  
  initCartForm() {
    return this._fb.group({
      productName:[''],
      productQuantity: [''],
      productPrice: [''],
      productTotalPrice: ['']
    });
  }

  showCartItems(items: any) {
    const control = <FormArray>this.updateCartForm.controls['carts'];
    for (var i = 0; i < items.length; i++) {
      control.push( this._fb.group({
          productName:[items[i].item.title],
          productQuantity: [items[i].qty],
          productPrice: [items[i].item.price],
          productTotalPrice: ['']
        })
      );
    };
  }

  clearCartFirstItem() {
    //Clears the first item because its initialized with ''
    const control = <FormArray>this.updateCartForm.controls['carts'];
    control.removeAt(0);
  }

  shoppingCartItems(cur: number) {
    this.shoppingcart.getCartItems()    //getCartItems observable gets the shopping cart items and stores it into the cartItems array
      .subscribe(
        data => {
          if (data.coins) {
            this.cartItems=data.coins;
            if (cur == 1) {
              this.cartTotalPrice = round(data.totalPrice, 2);  //total price of all the items in the shopping cart
            }
            else {
              this.cartTotalPrice = 0;
              data.coins.map(x => {
                this.cartTotalPrice = this.cartTotalPrice + (round(x.item.price * cur, 2) * x.qty);
              });
            }
            this.total_qty = data.totalQuantity;  //total quantity of items in the shopping cart
            //this.updateCartForm.value.carts[0].productName = this.cartItems[0].item.title;
            this.clearCartFirstItem();
            this.showCartItems(this.cartItems);
            this.getCurrencyRate();
          }
          else {
            this.clearCartFirstItem();
            this.cartItems = null;
            this.cartTotalPrice = 0;
            this.total_qty = 0;
          }
        },
        err => console.log(err),
        () => console.log('Get Cart Items Complete')
      )
  }

  removeItem(i: number) {
    // remove address from the list
    const control = <FormArray>this.updateCartForm.controls['carts'];
    control.removeAt(i);
    this.cartItems.splice(i, 1);
  }

  isFormValid(cartForm: any): boolean {
    for (let i=0; i<cartForm.carts.length; i++) {
      if (Number(cartForm.carts[i].productQuantity) < 1 || !Number.isInteger(Number(cartForm.carts[i].productQuantity))) {
        return false;
      }
    }
    return true;
  }

  updateCart(cartForm: any) {
    //console.log(cartForm);
    if (!this.isFormValid(cartForm)) {
      console.log("Invalid Quantity");
    }
    else {

    for (let i=0; i<cartForm.carts.length; i++) {
      this.cartItems[i].qty = cartForm.carts[i].productQuantity;
      this.cartItems[i].price = cartForm.carts[i].productQuantity * cartForm.carts[i].productPrice;
    }
    //console.log(this.cartItems);
    
    this.shoppingcart.updateCart(this.cartItems)
    .subscribe(
      data => {
        this.total_qty = data.totalQuantity;
        this.cartTotalPrice = 0;
        //console.log(data.items);
        Object.keys(data.items).map((key, index) => {
          this.cartTotalPrice = this.cartTotalPrice + (round(data.items[key].item.price * this.currency.rate, 2) * data.items[key].qty);
        });
      },
      err => console.log(err),
      () => console.log('Update cart complete')
    )
  }
  
  }

  // unsubscribe observables
  ngOnDestroy() {                    // <- New
    if(this.updateCartSubscription){
      this.updateCartSubscription.unsubscribe(); // <- New
    }
    if(this.currencySubscription){
      this.currencySubscription.unsubscribe();
    }
  }   
  /*
  shoppingCartItems() {
    this.shoppingcart.getCartItems()    //getCartItems observable gets the shopping cart items and stores it into the cartItems array
      .subscribe(
        data => {
          if (data.coins) {
            this.cartItems=data.coins;
            this.cartTotalPrice = data.totalPrice;  //total price of all the items in the shopping cart
            this.total_qty = data.totalQuantity;  //total quantity of items in the shopping cart
          }
          else {
            this.cartItems = null;
            this.cartTotalPrice = 0;
            this.total_qty = 0;
          }
        },
        err => console.log(err),
        () => console.log('Get Cart Items Complete')
      )
  }
  */

}
