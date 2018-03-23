import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
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

  private usernameMsg: string = "";
  private passwordMsg: string = "";
  private errorMsg: string = "";
  private redirectURL: string = "";
  private total_qty: number = 0;
  private loginForm: FormGroup;



  constructor (
    private userService: UserService,
    private shoppingCart: ShoppingCartService,
    private _router: Router,
    private fb: FormBuilder,
    private ngRedux: NgRedux<IAppState>
    ) {}

  ngOnInit() {
    this.createForm();
    this.getTotalQuantity();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  clearMsg() {
    this.usernameMsg = "";
    this.passwordMsg = "";
    this.errorMsg = "";
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

  login(_loginForm: FormGroup) {
    this.clearMsg();
    //console.log(_loginForm);
    if(!_loginForm.valid) {
      if (!_loginForm.controls.username.value) {
        this.usernameMsg = "Username is required";
      }
      if (!_loginForm.controls.password.value) {
        this.passwordMsg = "Password is required";
      }
    }
    else {
      this.userService.loginfn(_loginForm.controls.username.value, _loginForm.controls.password.value)
      .subscribe(data => {
        this.ngRedux.dispatch({type: "LOGIN"});

        this.redirectURL = sessionStorage.getItem('redirectURL') || "/home";
        this._router.navigate([this.redirectURL]);
        sessionStorage.removeItem('redirectURL');
      },
      err => {
        this.errorMsg = err.error.msg;
      },
      () => console.log('login complete')
      )
    } 
  }
}
