import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from "../store/model";
import { HeaderComponent } from '../header/header.component';
import { CheckoutOrderdetailsComponent } from './checkout-orderdetails/checkout-orderdetails.component';
import { CheckoutItemsComponent } from './checkout-items/checkout-items.component';

import { ShoppingCartService } from '../services/shopping.cart.service';
import { currency } from '../objects/currency.class';
import { round } from '../modules/round.module';

declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit{

    //model driven form
    private shoppingCartCheckoutForm: FormGroup;

    private errorMsg: string = "";
    private cardNumberMsg: string = "";
    private cardExpiryMsg: string = "";
    private cardCVCMsg: string = "";
    private cardMsg: string = "";
    private nameMsg: string = "";
    private addressLine1Msg: string = "";
    private cityMsg: string = "";
    private countryMsg: string = "";
  
    private cartItems: any = [];    //this array variable stores the shopping cart item objects
    private cartTotalPrice: number = 0; //this variable stores the total price of all the items in the shopping cart

    private total_qty: number = 0;    //stores the number of items in the variable and this number is shown beside the shopping cart link
    private stripe: any;
    private elements: any;
    private card: any;
    private cardNumber: any;
    private cardExpiry: any;
    private cardCvc: any;
    private postalCode: any;

    private currencySubscription: any;
    //private currencyRate: number = 1;
    private currency: currency = {
      currency: " USD",
      forex: "USD/USD",
      rate: 1
    };
  
    checkoutOrderInfo = {
      name: '',
      addressLine1: '',
      addressLine2: '',
      addressCity: '',
      addressState: '',
      addressZip: '',
      addressCountry: ''
    }
    constructor (
      private shoppingcart: ShoppingCartService,
      private _router: Router,
      private _fb: FormBuilder,
      private ngRedux: NgRedux<IAppState>
    ) {}
  
    ngOnInit() {
      this.checkCart();
      this.createForm();
      this.initCard();
    }

    createForm() {
      this.shoppingCartCheckoutForm = this._fb.group({
        name: ["", Validators.required],
        shippingAddress: this._fb.group({
          addressLine1: ["", Validators.required],
          addressLine2: [""],
          city: ["", Validators.required],
          state: [""],
          zip: [""],
          country: ["", Validators.required]
        })
      });
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
    
    coinPriceDisplay(price: number): string {
      return price.toFixed(2);
    }
    
    //this function is used so that the html template can access the round function module 
    roundPrice(num: number, precision: number): number {
      return round(num, precision);
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

    initCard() {
      this.stripe = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
      this.elements = this.stripe.elements();
      this.cardNumber = this.elements.create('cardNumber', {placeholder: "4242424242424242"});
      this.cardExpiry = this.elements.create('cardExpiry');
      this.cardCvc = this.elements.create('cardCvc');
      //this.postalCode = this.elements.create('postalCode');
      
      this.cardNumber.mount('#cardNumber-element');
      this.cardExpiry.mount('#cardExpiry-element');
      this.cardCvc.mount('#cardCvc-element');
      //this.postalCode.mount('#postalCode-element');
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
  
    clearMsg() {
      this.errorMsg = "";
      this.cardNumberMsg = "";
      this.cardExpiryMsg = "";
      this.cardCVCMsg = "";
      this.cardMsg = "";
      this.nameMsg = "";
      this.addressLine1Msg = "";
      this.cityMsg = "";
      this.countryMsg = "";
    }

    createToken(_shoppingCartCheckoutForm: any) {
      this.clearMsg();
      
      if(!_shoppingCartCheckoutForm.valid){
        if (_shoppingCartCheckoutForm.value.name == "") {
          this.nameMsg = "Full Name is required";
        }
        if (_shoppingCartCheckoutForm.value.shippingAddress.addressLine1 == "") {
          this.addressLine1Msg = "Address Line 1 is required";
        }
        if (_shoppingCartCheckoutForm.value.shippingAddress.city == "") {
          this.cityMsg = "City is required";
        }
        if (_shoppingCartCheckoutForm.value.shippingAddress.country == "") {
          this.countryMsg = "Country is required";
        }
      }
      else{
        this.stripe.createToken(this.cardNumber, {
          name: _shoppingCartCheckoutForm.value.name,
          address_line1: _shoppingCartCheckoutForm.value.shippingAddress.addressLine1,
          address_line2: _shoppingCartCheckoutForm.value.shippingAddress.addressLine2,
          address_city: _shoppingCartCheckoutForm.value.shippingAddress.city,
          address_state: _shoppingCartCheckoutForm.value.shippingAddress.state,
          address_zip: _shoppingCartCheckoutForm.value.shippingAddress.zip,
          address_country: _shoppingCartCheckoutForm.value.shippingAddress.country
        })
        .then((result:any) => {   //must use arrow function to preserve "this" keyword, otherwise cannot make function call to chargeCard()
        if (result.error) {
          if (result.error.code == "invalid_number") {
            this.cardNumberMsg = result.error.message;
          }
          else if (result.error.code == "incorrect_number") {
            this.cardNumberMsg = result.error.message;
          }
          else if (result.error.code == "incomplete_number") {
            this.cardNumberMsg = result.error.message;
          }
          else if (result.error.code == "incomplete_expiry") {
            this.cardExpiryMsg = result.error.message;
          }
          else if (result.error.code == "invalid_expiry_month") {
            this.cardExpiryMsg = result.error.message;
          }
          else if (result.error.code == "invalid_expiry_year") {
            this.cardExpiryMsg = result.error.message;
          }
          else if (result.error.code == "invalid_expiry_year_past") {
            this.cardExpiryMsg = result.error.message;
          }
          else if (result.error.code == "incomplete_cvc") {
            this.cardCVCMsg = result.error.message;
          }
          else if (result.error.code == "incorrect_cvc") {
            this.cardCVCMsg = result.error.message;
          }
          else if (result.error.code == "invalid_cvc") {
            this.cardCVCMsg = result.error.message;
          }
          else if (result.error.code == "expired_card") {
            this.cardMsg = result.error.message;
          }
          else if (result.error.code == "card_declined") {
            this.cardMsg = result.error.message;
          }
          else if (result.error.code == "missing") {
            this.cardMsg = result.error.message;
          }
          else if (result.error.code == "processing_error") {
            this.cardMsg = result.error.message;
          }
          else if (result.error.code == "invalid_swipe_data") {
            this.cardMsg = result.error.message;
          }
        }
          else {
            this.stripeTokenHandler(result.token);
          }
        });
      }
      
    }
    ngOnDestroy() {                    // <- New
      if(this.currencySubscription){
        this.currencySubscription.unsubscribe();
      }
    }  
    
  }
