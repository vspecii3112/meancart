import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../services/user.service';
import { ShoppingCartService } from '../services/shopping.cart.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  private fnameMsg: string = '';
  private lnameMsg: string = '';
  private emailMsg: string = '';
  private usernameMsg: string = '';
  private passwordMsg: string = '';
  private total_qty: number = 0;

  constructor (
    private _userService: UserService,
    private shoppingCart: ShoppingCartService,
    private _router: Router,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getTotalQuantity();
    this.createForm();
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

  createForm() {
    this.signupForm = this._fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  clearMsg() {
    this.fnameMsg = '';
    this.lnameMsg = '';
    this.emailMsg = '';
    this.usernameMsg = '';
    this.passwordMsg = '';
  }

  signup(_signupForm) {
    this.clearMsg();

    if (!_signupForm.valid) {
      if (!_signupForm.controls.fname.value) {
        this.fnameMsg = "First name is required";
      }
      if (!_signupForm.controls.lname.value) {
        this.lnameMsg = "Last name is required";
      }
      if (!_signupForm.controls.username.value) {
        this.usernameMsg = "Username is required";
      }
      if (_signupForm.controls.email.errors) {
        if (_signupForm.controls.email.errors.required) {
          this.emailMsg = "Email is required";
        }
        else {
          this.emailMsg = "Invalid email address";
        }
      }
      if (_signupForm.controls.password.errors) {
        if (_signupForm.controls.password.errors.required) {
          this.passwordMsg = "Password is required";
        }
        else {
          this.passwordMsg = "Password need to be at least 6 characters in length"
        }
      }
    }
    
    else{
      this._userService.signupfn(_signupForm.value)
      .subscribe( data => {
        if(data.authenticated) {
          console.log('signup is success');
          this._router.navigate(['/home']);
        }
      },
      err => {
        console.log(err.error.msg);
      },
      () => console.log('signup complete')
      )
    }
    
  }
}