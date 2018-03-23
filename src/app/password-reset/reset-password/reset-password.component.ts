import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private tokenValid: boolean = false;
  private token: string = "";
  private newPwMsg: string = "";
  private confirmPwMsg: string = "";
  private errorMsg: string = "";
  private successMsg: string = "";
  private resetPwForm: FormGroup;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private fb: FormBuilder) {
    activatedRoute.params.subscribe(params => {
      this.token = params.token;
      this.checkToken(params.token);
    });
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.resetPwForm = this.fb.group({
      newPw: ['', [Validators.required, Validators.minLength(6)]],
      confirmPw: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  clearMsg() {
    this.newPwMsg = "";
    this.confirmPwMsg = "";
    this.errorMsg = "";
    this.successMsg = "";
  }

  checkToken(token: string) {
    this.userService.checkPwToken(token)
    .subscribe(
      data => {
        this.tokenValid = data.tokenValid;
      },
      err => {
        this.errorMsg = err.error.msg;
      },
      () => console.log('complete checking token')
    )

  }

  resetPassword(_resetPwForm:any) {
    this.clearMsg();
    if (!_resetPwForm.valid) {
      if (_resetPwForm.controls.newPw.errors) {
        if (_resetPwForm.controls.newPw.errors.required) {
          this.newPwMsg = "Password is required";
        }
        else {
          this.newPwMsg = "Password need to be at least 6 characters in length"
        }
      }
      if (_resetPwForm.controls.confirmPw.errors) {
        if (_resetPwForm.controls.confirmPw.errors.required) {
          this.confirmPwMsg = "Confirm password is required";
        }
        else {
          this.confirmPwMsg = "Password need to be at least 6 characters in length"
        }
      }
    }
    else if (_resetPwForm.value.newPw !== _resetPwForm.value.confirmPw) {
      this.errorMsg = "Confirm new password does not match new password";
    }
    else {
      this.userService.resetPassword(_resetPwForm.value.newPw, this.token)
      .subscribe(data => {
        this.successMsg = data.msg;
        this.tokenValid = false;
        this.resetPwForm.reset();
      },
      err => {
        this.errorMsg = err.error.msg;
      },
      () => console.log('Reset password complete')
      )
    }
  }

}
