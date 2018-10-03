import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { currency } from '../../objects/currency.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { round } from '../../modules/round.module';

declare var Stripe: any;

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css']
})
export class CheckoutFormComponent implements OnInit {

  public shoppingCartCheckoutForm: FormGroup;

  private cardNumberMsg: string = "";
  private cardExpiryMsg: string = "";
  private cardCVCMsg: string = "";
  private cardMsg: string = "";
  private nameMsg: string = "";
  private addressLine1Msg: string = "";
  private cityMsg: string = "";
  private countryMsg: string = "";

  private stripe: any;
  private elements: any;
  private card: any;
  private cardNumber: any;
  private cardExpiry: any;
  private cardCvc: any;
  private postalCode: any;

  constructor(
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
    this.initCard();
  }

  @Input()
  cartItems: any;
  @Input()
  currency: currency;
  @Input()
  cartTotalPrice: number;
  @Input()
  errorMsg: string;
  @Output()
  stripeTokenEmitter = new EventEmitter<any>();

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

  coinPriceDisplay(price: number): string {
    return price.toFixed(2);
  }

  //this function is used so that the html template can access the round function module 
  roundPrice(num: number, precision: number): number {
    return round(num, precision);
  }

  checkCheckoutFormFields(checkoutFormValue: any) {
    if (checkoutFormValue.name == "") {
      this.nameMsg = "Full Name is required";
    }
    if (checkoutFormValue.shippingAddress.addressLine1 == "") {
      this.addressLine1Msg = "Address Line 1 is required";
    }
    if (checkoutFormValue.shippingAddress.city == "") {
      this.cityMsg = "City is required";
    }
    if (checkoutFormValue.shippingAddress.country == "") {
      this.countryMsg = "Country is required";
    }
  }

  checkStripeTokenError(err: any) {
    if (err.code == "invalid_number") {
      this.cardNumberMsg = err.message;
    }
    else if (err.code == "incorrect_number") {
      this.cardNumberMsg = err.message;
    }
    else if (err.code == "incomplete_number") {
      this.cardNumberMsg = err.message;
    }
    else if (err.code == "incomplete_expiry") {
      this.cardExpiryMsg = err.message;
    }
    else if (err.code == "invalid_expiry_month") {
      this.cardExpiryMsg = err.message;
    }
    else if (err.code == "invalid_expiry_year") {
      this.cardExpiryMsg = err.message;
    }
    else if (err.code == "invalid_expiry_year_past") {
      this.cardExpiryMsg = err.message;
    }
    else if (err.code == "incomplete_cvc") {
      this.cardCVCMsg = err.message;
    }
    else if (err.code == "incorrect_cvc") {
      this.cardCVCMsg = err.message;
    }
    else if (err.code == "invalid_cvc") {
      this.cardCVCMsg = err.message;
    }
    else if (err.code == "expired_card") {
      this.cardMsg = err.message;
    }
    else if (err.code == "card_declined") {
      this.cardMsg = err.message;
    }
    else if (err.code == "missing") {
      this.cardMsg = err.message;
    }
    else if (err.code == "processing_error") {
      this.cardMsg = err.message;
    }
    else if (err.code == "invalid_swipe_data") {
      this.cardMsg = err.message;
    }
  }

  createToken(_shoppingCartCheckoutForm: any) {
    this.clearMsg();
    
    if(!_shoppingCartCheckoutForm.valid){
      this.checkCheckoutFormFields(_shoppingCartCheckoutForm.value);
    }
    else{
      //console.log(_shoppingCartCheckoutForm.controls.shippingAddress.controls);
      
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
        this.checkStripeTokenError(result.error);
      }
      else {
        this.stripeTokenEmitter.emit(result.token);
        }
      });
    }
    
  }

}
