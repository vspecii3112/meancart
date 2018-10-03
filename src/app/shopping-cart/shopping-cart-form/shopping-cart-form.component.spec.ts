import {TestBed, async, fakeAsync, ComponentFixture, tick} from '@angular/core/testing';
import { ShoppingCartFormComponent } from "./shopping-cart-form.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe("test ShoppingCart form", () => {

    let shoppingCartFormComponent: ShoppingCartFormComponent;
    let fixture: ComponentFixture<ShoppingCartFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShoppingCartFormComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ShoppingCartFormComponent);
            shoppingCartFormComponent = fixture.componentInstance;
        });
    }));

    it("test form if its defined", () => {
        expect(shoppingCartFormComponent.updateCartForm).toBeDefined();
    });

    it("Should test the function showCartItems() to populate the form Array with items, and also the function formUpdateEvent()", fakeAsync(() => {
        const dummyCartItems = [
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
        const dummyFormItems = [
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
                productTotalPrice: ""
            }
        ];
        let cartValues = [];
        shoppingCartFormComponent.updateCartEmitter.subscribe( value => {
            cartValues = value;
        });
        shoppingCartFormComponent.showCartItems(dummyCartItems);
        tick(10000);

        expect(shoppingCartFormComponent.updateCartForm.value.carts[0].productName).toEqual("Silver Moose");
        expect(shoppingCartFormComponent.updateCartForm.value.carts[0].productQuantity).toEqual(1);
        expect(shoppingCartFormComponent.updateCartForm.value.carts[0].productPrice).toEqual(40);
        expect(shoppingCartFormComponent.updateCartForm.value.carts[0].productTotalPrice).toEqual("");

        
        expect(shoppingCartFormComponent.updateCartForm.value.carts[1].productName).toEqual("Silver Wood Bison");
        expect(shoppingCartFormComponent.updateCartForm.value.carts[1].productQuantity).toEqual(1);
        expect(shoppingCartFormComponent.updateCartForm.value.carts[1].productPrice).toEqual(33);
        expect(shoppingCartFormComponent.updateCartForm.value.carts[1].productTotalPrice).toEqual("");

        expect(cartValues[0].productName).toEqual("Silver Moose");
        expect(cartValues[0].productQuantity).toEqual(1);
        expect(cartValues[0].productPrice).toEqual(40);
        expect(cartValues[0].productTotalPrice).toEqual("");

        expect(cartValues[1].productName).toEqual("Silver Wood Bison");
        expect(cartValues[1].productQuantity).toEqual(1);
        expect(cartValues[1].productPrice).toEqual(33);
        expect(cartValues[1].productTotalPrice).toEqual("");
        
    }));
/*
    it("test form is invalid when only username is empty", () => {
        let password = loginFormComponent.loginForm.controls["password"];
        password.setValue("1234567");
        expect(loginFormComponent.loginForm.valid).toBeFalsy();
    });
    
    it("test form is valid when fields are not empty", () => {
        loginFormComponent.loginForm.controls["username"].setValue("test1");
        loginFormComponent.loginForm.controls["password"].setValue("1234567");
        expect(loginFormComponent.loginForm.valid).toBeTruthy();
    });

    it("test form when emitting correct value", ()=> {
        let uname: string = "";
        let pword: string = "";

        loginFormComponent.loginEmitter.subscribe(value => {
            uname = value.username;
            pword = value.password;
        });

        loginFormComponent.loginForm.controls["username"].setValue("test1");
        loginFormComponent.loginForm.controls["password"].setValue("1234567");

        loginFormComponent.login(loginFormComponent.loginForm);

        expect(uname).toBe("test1");
        expect(pword).toBe("1234567");

    });
*/
});