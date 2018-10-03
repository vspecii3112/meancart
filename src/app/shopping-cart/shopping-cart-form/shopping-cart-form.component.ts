import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { round } from '../../modules/round.module';
import { currency } from '../../objects/currency.class';

@Component({
  selector: 'app-shopping-cart-form',
  templateUrl: './shopping-cart-form.component.html',
  styleUrls: ['./shopping-cart-form.component.css']
})
export class ShoppingCartFormComponent implements OnInit, OnChanges, OnDestroy {

  public updateCartForm: FormGroup; //our form model
  public updateCartSubscription: any;

  constructor(
    public _fb: FormBuilder
  ) {
    this.createForm();
  }

  @Input()
  cartItems: any;

  @Input()
  currency: currency;

  @Input()
  cartTotalPrice: number;

  @Input()
  formCheck: any

  @Input()
  totalQuantity: number;

  @Output()
  updateCartEmitter = new EventEmitter<any>();

  ngOnInit() {
    
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if(changes["cartItems"]){
      let items = changes["cartItems"].currentValue;
      this.showCartItems(items);
    }
  }
  

  ngOnDestroy() {
    if(this.updateCartSubscription){
      this.updateCartSubscription.unsubscribe(); // <- New
    }
  }

  formUpdateEvent() {
    this.updateCartSubscription = this.updateCartForm.valueChanges
    .debounceTime(500)
    .distinctUntilChanged()
    .subscribe(data => {
      //this will automatically update the total price and the store session
        if (this.updateCartForm.valid) {
          //console.log(data.carts);
          this.updateCartEmitter.emit(data.carts);
        }
    });
  }

  createForm() {
    //create the form
    this.updateCartForm = this._fb.group({
      carts: this._fb.array([
        //this.initCartForm(),  //initialize the form
      ])
    });
    this.formUpdateEvent();
  }
/*
  initCartForm() {
    return this._fb.group({
      productName:[''],
      productQuantity: ['', Validators.required, Validators.pattern("^[1-9][0-9]*$")],  //regular expression for positive integers
      productPrice: [''],
      productTotalPrice: ['']
    });
  }
*/
  showCartItems(items: any) {
    //console.log(items);
    const control = <FormArray>this.updateCartForm.controls['carts'];

    items.map((x,i)=> {
      control.insert(i, this._fb.group({
        productName:[x.item.title],
        productQuantity: [x.qty, [Validators.required, Validators.pattern("^[1-9][0-9]*$")]], //regular expression for positive integers
        productPrice: [x.item.price],
        productTotalPrice: ['']
      }));
    });
    //console.log(this.updateCartForm);
    //control.removeAt(items.length);
  }

  removeItem(i: number) {
    // remove address from the list
    const control = <FormArray>this.updateCartForm.controls['carts'];
    control.removeAt(i);
    this.cartItems.splice(i, 1);
  }

  //This function is for display purposes to show the price with 2 decimal places
  coinPrice(price: number, qty: number = 1): string {
    //console.log(this.round(33 * 1.287168 * 2, 2));
    return (round(price * this.currency.rate, 2) * qty).toFixed(2);
  }

  coinPriceDisplay(price: number): string {
    return price.toFixed(2);
  }
}
