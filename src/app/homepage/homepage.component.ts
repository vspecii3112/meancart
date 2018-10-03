import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from "../store/model";
import { HomepageIntroComponent } from './homepage-intro/homepage-intro.component';
import { HomepageAboutComponent } from './homepage-about/homepage-about.component';
import { HomepageShopComponent } from './homepage-shop/homepage-shop.component';
import { LoadCoinInfoService } from '../services/load.coin.info.service';
import { ShoppingCartService } from '../services/shopping.cart.service';
import { coin } from '../objects/coin.class';
import { currency } from '../objects/currency.class';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit{

  private coins: coin[] = null;   //the coins array variable stores the coin objects
  private total_qty: number = 0;    //stores the number of items in the variable and this number is shown beside the shopping cart link
  private total_price: number = 0;  //stores the total price of the shopping cart and this number is shown beside the shopping cart link
  private currencySubscription: any;
  //private currencyRate: number = 1;
  private currency: currency = {
    currency: " USD",
    forex: "USD/USD",
    rate: 1
  };

    constructor(
      private loadCoinInfo: LoadCoinInfoService,
      private shoppingCart: ShoppingCartService,
      private ngRedux: NgRedux<IAppState>
    ) {}
  
    ngOnInit() {
      this.displayAllCoins();
      this.getTotalQuantity();
    }

    //The displayAllCoins function will display the coins available from the mongoDB backend
    displayAllCoins(){
      this.loadCoinInfo.getCoins()    //getCoins observable gets the coins from the mongoDB backend and stores it into the coins array
        .subscribe(
          data => {
            //this.coins=data.msg.map((s:any)=>JSON.parse(JSON.stringify(s)));    //maps the contents of the returned objects to coins[] array. JSON.parse will remove the quotes in the string.
            this.coins = data.msg;
            this.getCurrencyRate();
          },
          err => console.log('error display all coins'),
          () => console.log('complete display all coins')
        )
    }
  
    //The getTotalQuantity function will get the number of items in the shopping cart and stores it in the variable total_qty
    getTotalQuantity() {
      this.shoppingCart.getTotalQuantity()
        .subscribe(
          data => {
            this.total_qty = data.totalQuantity;
          },
          err => console.log('error getting item quantity'),
          () => console.log('complete getting item quantity')
        )
  
    }
  
    //this function checks if an input is an integer and greater than 0
    isValidInput(input: number): boolean {
      if (Number(input) < 1 || !Number.isInteger(Number(input))) {
        return false;
      }
      return true;
    }

    getCurrencyRate() {
      this.currencySubscription = this.ngRedux.select<any>()
      .subscribe(newCurrency => {
        this.currency = newCurrency.switchCurrencyReducer.currency;
      });
    }

    // The addItemToCart function handles the button event, when clicked, it will add to the shopping cart and store the number of items in the shopping cart to the variable total_qty
    addItemToCart(event) {   //click event handler
      // Checks if the value entered is an integer and greater than 0
      if (!this.isValidInput(event.itemQty)){
        console.log('invalid value');
      }
      else {
        this.shoppingCart.addItem(event.coinID, event.itemQty)
          .subscribe(
            data => {
              this.total_qty = data.totalQuantity;
              this.total_price = data.totalPrice;
            },
            err => console.log('error adding coins to cart'),
            () => console.log('complete adding item to cart')
          )
      }
    }

    ngOnDestroy() {                    // <- New
      if(this.currencySubscription){
        this.currencySubscription.unsubscribe();
      }
    }   
  }
