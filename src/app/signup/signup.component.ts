import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { ShoppingCartService } from '../services/shopping.cart.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  private total_qty: number = 0;
  private errorMsg: string = "";

  constructor (
    private _userService: UserService,
    private shoppingCart: ShoppingCartService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.getTotalQuantity();
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

  signup(event) {
    this.errorMsg = "";

    this._userService.signupfn(event)
    .subscribe( data => {
      if(data.authenticated) {
        console.log('signup is success');
        this._router.navigate(['/home']);
      }
    },
    err => {
      this.errorMsg = err.error.msg;
    },
    () => console.log('signup complete')
    )
    
  }
}