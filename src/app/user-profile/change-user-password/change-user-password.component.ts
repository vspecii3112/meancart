import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { UserService } from '../../services/user.service';
import { ShoppingCartService } from '../../services/shopping.cart.service';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.css']
})
export class ChangeUserPasswordComponent implements OnInit {

  private errorMsg: string = "";
  private currentPwMsg: string = "";
  private newPwMsg: string = "";
  private confirmNewPwMsg: string = "";
  private successMsg: string = "";
  private changePwForm: FormGroup;
  private total_qty: number = 0;

  constructor (
    private _userService: UserService,
    private shoppingCart: ShoppingCartService,
    private _router: Router,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    this.getTotalQuantity();
  }

  createForm() {
    this.changePwForm = this.fb.group({
      currentPw: ['', Validators.required],
      newPw: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPw: ['', [Validators.required, Validators.minLength(6)]]
    });
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

  clearMsg() {
    this.currentPwMsg = "";
    this.newPwMsg = "";
    this.confirmNewPwMsg = "";
    this.errorMsg = "";
    this.successMsg = "";
  }
  
  changePw(_changePwForm: any) {
    //console.log(_changePwForm);

    this.clearMsg();

    if(!_changePwForm.valid) {
      if (!_changePwForm.value.currentPw) {
        this.currentPwMsg = "Current password required";
      }
      if (_changePwForm.controls.newPw.errors) {
        if (_changePwForm.controls.newPw.errors.required) {
          this.newPwMsg = "New password required";
        }
        if (_changePwForm.controls.newPw.errors.minlength) {
          this.newPwMsg = "Password must contain at least 6 characters";
        }
      }
      if (_changePwForm.controls.confirmNewPw.errors) {
        if (_changePwForm.controls.confirmNewPw.errors.required) {
          this.confirmNewPwMsg = "Confirm new password required";
        }
        if (_changePwForm.controls.confirmNewPw.errors.minlength) {
          this.confirmNewPwMsg = "Password must contain at least 6 characters";
        }
      }
    }
    else if (_changePwForm.value.newPw == _changePwForm.value.currentPw) {
      this.errorMsg = "New password must be different than current password";
    }
    else if (_changePwForm.value.newPw !== _changePwForm.value.confirmNewPw) {
      this.errorMsg = "Confirm new password does not match new password";
    }
    else {
      this._userService.changePassword(_changePwForm.value.currentPw, _changePwForm.value.newPw)
        .subscribe(data => {
          this.successMsg = "Password changed successfully"
          this.changePwForm.reset();
        },
        err => {
          this.errorMsg = err.error.msg;
        },
        () => console.log('update password complete')
      )
    } 

    /*
    this._userService.changePassword(this.credentials)
        .subscribe(data => {
          if(data.redirect) {
            console.log(data.msg);
          }
        },
        err => {
          console.log(err.msg);
          this.loginMsg = err.msg;
        },
        () => console.log('change password complete')
      )
      */
  }
}

