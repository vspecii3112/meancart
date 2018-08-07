import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ShoppingCartService } from '../services/shopping.cart.service';
import { UserService } from '../services/user.service';

import { NgRedux } from '@angular-redux/store';
import { IAppState } from "../store/model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{

  private errorMsg: string = "";
  private redirectURL: string = "";
  private total_qty: number = 0;
  

  constructor (
    private userService: UserService,
    private shoppingCart: ShoppingCartService,
    private _router: Router,
    private ngRedux: NgRedux<IAppState>
    ) {}

  ngOnInit() {
    this.getTotalQuantity();
  }



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

  login(event) {
    this.errorMsg = "";
    this.userService.loginfn(event.username, event.password)
    .subscribe(data => {
      let redirect: string = "";
      this.ngRedux.dispatch({type: "LOGIN"});

      redirect = sessionStorage.getItem('redirectURL') || "/home";
      this._router.navigate([redirect]);
      sessionStorage.removeItem('redirectURL');
    },
    err => {
      this.errorMsg = err.error.msg;
    },
    () => console.log('login complete')
    )

  }
}
