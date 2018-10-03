import { Component, Input, Output, EventEmitter } from '@angular/core';
import {TestBed, async, fakeAsync, ComponentFixture, tick} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ShoppingCartComponent } from "./shopping-cart.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from "../store/model";

import { Observable } from 'rxjs/Observable'; 

//import { StoreModule } from "../store/module";
import { ShoppingCartService } from '../services/shopping.cart.service';
import { currency } from '../objects/currency.class';

class ShoppingCartServiceStub {
    public getCartItems(): Observable<any> {
        return Observable.of({
            cart: {
                items: {
                    "5a87328d15abcc2c60c8d585": {
                        item: {
                            country: "Canada",
                            description: "Canadian silver moose coin",
                            finess: "9999",
                            imagePath: "3.jpg",
                            material: "silver",
                            price: 40,
                            quantity: 15,
                            title: "Silver Moose",
                            weight: "1oz",
                            year: 2012,
                            __v: 0,
                            _id: "5a87328d15abcc2c60c8d585"
                        },
                        price: 40,
                        qty: 1
                    },
                    "5a87328d15abcc2c60c8d586": {
                        item: {
                            country: "Canada",
                            description: "Canadian silver wood bison coin",
                            finess: "9999",
                            imagePath: "4.jpg",
                            material: "silver",
                            price: 33,
                            quantity: 25,
                            title: "Silver Wood Bison",
                            weight: "1oz",
                            year: 2013,
                            __v: 0,
                            _id: "5a87328d15abcc2c60c8d586"
                        },
                        price: 33,
                        qty: 1
                    }
                },
                totalPrice: 73,
                totalQty: 2
            }
        });
      }

      public updateCart(cartItems): Observable<any> {
          return Observable.of({
            totalQuantity: 6
          });
      }
}

class NgReduxStub {
    public select(): Observable<any> {
        return Observable.of({
            switchCurrencyReducer: {
                currency: {
                    currency: "CAD",
                    forex: "USD/CAD",
                    rate: 1.313382
                }
            } 
        });
    }
}

@Component({
    selector: 'app-header',
    template: '<p>Mock Header Component</p>'
  })
  class MockHeaderComponent {
    constructor() {}
    @Input() totalQuantity: number;
  }

@Component({
    selector: 'app-shopping-cart-form',
    template: '<p>Mock Shopping Cart Form Component</p>'
})
class MockShoppingCartFormComponent {
    constructor() {}
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
}

let shoppingCartServiceStub: ShoppingCartServiceStub;
let ngReduxStub: NgReduxStub;

describe("test shopping cart page", () => {

    let shoppingCartComponent: ShoppingCartComponent;
    let fixture: ComponentFixture<ShoppingCartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShoppingCartComponent, MockHeaderComponent, MockShoppingCartFormComponent],
            imports: [
                //HeaderModule,
                //StoreModule,
                //CheckoutModule,
                RouterTestingModule,
                FormsModule,
                ReactiveFormsModule
            ]
            //schemas: [ NO_ERRORS_SCHEMA ]
        }).overrideComponent(ShoppingCartComponent, {
            set: {
                providers: [
                    { provide: ShoppingCartService, useClass: ShoppingCartServiceStub },
                    { provide: NgRedux, useClass: NgReduxStub }
                ]
            }
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ShoppingCartComponent);
            shoppingCartComponent = fixture.componentInstance;
            shoppingCartServiceStub = fixture.debugElement.injector.get(ShoppingCartService);
            ngReduxStub = fixture.debugElement.injector.get(NgRedux);
            //shoppingCartComponent.ngOnInit();
        });
    }));

    it('should test the function getCurrencyRate()', fakeAsync(() => {
        const dummyResult = {
            currency: "CAD",
            forex: "USD/CAD",
            rate: 1.313382
        };

        shoppingCartComponent.getCurrencyRate();
        fixture.detectChanges();
        expect(shoppingCartComponent.currency).toEqual(dummyResult);
    }));

    it('should test the function shoppingCartItems()', fakeAsync(() => {
        const dummyResult = [
            {
                item: {
                    country: "Canada",
                    description: "Canadian silver moose coin",
                    finess: "9999",
                    imagePath: "3.jpg",
                    material: "silver",
                    price: 40,
                    quantity: 15,
                    title: "Silver Moose",
                    weight: "1oz",
                    year: 2012,
                    __v: 0,
                    _id: "5a87328d15abcc2c60c8d585"
                },
                price: 40,
                qty: 1
            },
            {
                item: {
                    country: "Canada",
                    description: "Canadian silver wood bison coin",
                    finess: "9999",
                    imagePath: "4.jpg",
                    material: "silver",
                    price: 33,
                    quantity: 25,
                    title: "Silver Wood Bison",
                    weight: "1oz",
                    year: 2013,
                    __v: 0,
                    _id: "5a87328d15abcc2c60c8d586"
                },
                price: 33,
                qty: 1
            }
        ];
        shoppingCartComponent.shoppingCartItems();
        fixture.detectChanges();
        expect(shoppingCartComponent.cartItems).toEqual(dummyResult);
        //expect(spy.calls.any()).toEqual(true);
      }));

      it("Should test the function CalculateTotalPrice()", () => {
        shoppingCartComponent.currency = {
            currency: "USD",
            forex: "USD/USD",
            rate: 1
        };
        const dummyArray = [
            {
                productName: "Silver Wood Bison",
                productQuantity: 1,
                productPrice: 33,
                productTotalPrice: ""
            },
            {
                productName: "Silver Moose",
                productQuantity: 1,
                productPrice: 40,
                productTotalPrice: ""}
        ]
        expect(shoppingCartComponent.calculateTotalPrice(dummyArray)).toEqual(73);
      });

      it("should test the function updateCart()", () => {
        const dummyFormFieldsArray = [
            {
                productName: "Silver Wood Bison",
                productQuantity: 3,
                productPrice: 33,
                productTotalPrice: ""
            },
        ];

        const dummyCartItemsBefore = [
            {
                item: {
                    country: "Canada",
                    description: "Canadian silver wood bison coin",
                    finess: "9999",
                    imagePath: "4.jpg",
                    material: "silver",
                    price: 33,
                    quantity: 25,
                    title: "Silver Wood Bison",
                    weight: "1oz",
                    year: 2013,
                    __v: 0,
                    _id: "5a87328d15abcc2c60c8d586"
                },
                price: 33,
                qty: 1
            }
        ];

        const dummyCartItemsAfter = [
            {
                item: {
                    country: "Canada",
                    description: "Canadian silver wood bison coin",
                    finess: "9999",
                    imagePath: "4.jpg",
                    material: "silver",
                    price: 33,
                    quantity: 25,
                    title: "Silver Wood Bison",
                    weight: "1oz",
                    year: 2013,
                    __v: 0,
                    _id: "5a87328d15abcc2c60c8d586"
                },
                price: 99,
                qty: 3
            }
        ];
        shoppingCartComponent.cartItems = dummyCartItemsBefore;
        shoppingCartComponent.updateCart(dummyFormFieldsArray);
        expect(shoppingCartComponent.cartItems[0].price).toBe(dummyCartItemsAfter[0].price);
        expect(shoppingCartComponent.cartItems[0].qty).toBe(dummyCartItemsAfter[0].qty);
      });
      

      it("Should test the function updateCartSession(cartItems)", fakeAsync( ()=>{
          const dummyCartItems = [];

          shoppingCartComponent.ngOnInit();
          tick(10000);
          fixture.detectChanges();

          shoppingCartComponent.total_qty = 0;
          shoppingCartComponent.updateCartSession(dummyCartItems);
          tick(10000);
          fixture.detectChanges();
          expect(shoppingCartComponent.total_qty).toEqual(6);
      }));
});


//An example of creating a spy using existing objects
/*
        const spy = spyOn(ngReduxStub, 'select').and.returnValue(Observable.of({
            switchCurrencyReducer: {
                currency: {
                    currency: "CAD",
                    forex: "USD/CAD",
                    rate: 1.313382
                }
            }
        }));
*/