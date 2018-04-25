import { Component, Input, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { UserService } from '../services/user.service';
import { ShoppingCartService } from '../services/shopping.cart.service';
import { currency } from '../objects/currency.class';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from "../store/model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  
    constructor(
      private _userService: UserService,
      private shoppingCart: ShoppingCartService,
      private _router: Router,
      private ngRedux: NgRedux<IAppState>
    ) {}
  
    ngOnInit(){
      this.checkAuthentication();
      this.checkCurrency();
    }
  
    private loggedIn: boolean = false;
    private title: string = 'Bullion Coins Store';
    
    private selectedCurrency: currency = {
      currency: "USD",
      forex: "USD/USD",
      rate: 1
    }

    //private selectedCurrencyRate: number = 1;
  
    @Input() totalQuantity: number;   //gets the total quantity from the parent

    checkCurrency() {
      this.shoppingCart.checkCurrency()
        .subscribe(data => {
          this.selectedCurrency = data.selectedCurrency;
          //this.currencyEmitter.emit({currency: data.selectedCurrency.currency, rate: data.selectedCurrency.rate});
        },
        err => {
          console.log(err);
        },
        () => console.log("check currency complete")
      )
    }

    checkAuthentication() {
      this._userService.isLoggedIn()
        .subscribe(data => {
          if(data.authenticated) {
            this.loggedIn = true;
          }
          else {
            this.loggedIn = false;
          }
        },
          err => {
            console.log(err.msg);
          },
          () => console.log('authentication complete')
        )
    }

    changeCurrency(currency: string) {
      this.shoppingCart.changeCurrency(currency)
        .subscribe(
          data => {
            console.log(data.selectedCurrency.currency);
            this.selectedCurrency = data.selectedCurrency;
          },
          err => console.log(err),
          () => console.log('change currency complete')
        )
    }
  
    userLogout(){
      this._userService.logoutfn()
        .subscribe(
          data => {
              this.ngRedux.dispatch({type: "LOGOUT"});
              this.checkAuthentication();   //Checks the authentication of the user to get the latest update so that Angular will re-render the page when it reloads the same URL.
              this._router.navigate(['/home']);
          },
          err => console.log('Internal server error'),
          () => console.log('logout complete')
        )
    }
  
  }
