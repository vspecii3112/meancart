import { Component, Input } from '@angular/core';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { CheckoutFormComponent } from "./checkout-form.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { currency } from '../../objects/currency.class';

declare var Stripe: any;

@Component({
    selector: 'app-checkout-items',
    template: '<p>Mock Checkout Items Component</p>'
  })
  class MockCheckoutItemsComponent {
    constructor() {}
    @Input()
    cartItemsArray: any;
    @Input()
    currency: currency;
  }

  @Component({
    selector: 'app-checkout-orderdetails',
    template: '<p>Mock Checkout Order Details Component</p>'
  })
  class MockCheckoutOrderDetailsComponent {
    constructor() {}
    @Input()
    _cartTotalPrice: number;
    @Input()
    currency: currency;
  }

describe("Test checkout form", ()=> {

    let checkoutFormComponent: CheckoutFormComponent;
    let fixture: ComponentFixture<CheckoutFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CheckoutFormComponent, MockCheckoutItemsComponent, MockCheckoutOrderDetailsComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CheckoutFormComponent);
            checkoutFormComponent = fixture.componentInstance;
            checkoutFormComponent.createForm();
            //checkoutFormComponent.ngOnInit();
        });
    }));

    it("test address form if its defined", () => {
        expect(checkoutFormComponent.shoppingCartCheckoutForm).toBeDefined();
    });

    it("test address form is invalid when all fields are empty", () => {
        expect(checkoutFormComponent.shoppingCartCheckoutForm.valid).toBeFalsy();
    });

    it("test address form is valid when all required fields are present", () => {
        checkoutFormComponent.shoppingCartCheckoutForm.controls["name"].setValue("jack");
        let shipAddress = checkoutFormComponent.shoppingCartCheckoutForm.controls["shippingAddress"];
        shipAddress.setValue({
            addressLine1: "ad1",
            addressLine2: "",
            city: "Aruba",
            state: "",
            zip: "",
            country: "Canada"
        });
        expect(checkoutFormComponent.shoppingCartCheckoutForm.valid).toBeTruthy();
    });

    it("test address form is invalid when one required field is empty", () => {
        checkoutFormComponent.shoppingCartCheckoutForm.controls["name"].setValue("jack");
        let shipAddress = checkoutFormComponent.shoppingCartCheckoutForm.controls["shippingAddress"];
        shipAddress.setValue({
            addressLine1: "ad1",
            addressLine2: "",
            city: "",
            state: "",
            zip: "",
            country: "Canada"
        });
        expect(checkoutFormComponent.shoppingCartCheckoutForm.valid).toBeFalsy();
    });

});