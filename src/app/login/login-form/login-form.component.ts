import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  private usernameMsg: string = "";
  private passwordMsg: string = "";

  public loginForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  @Input()
    errorMsg: string;

  @Output()
    loginEmitter = new EventEmitter<any>();

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  clearMsg() {
    this.usernameMsg = "";
    this.passwordMsg = "";
  }

  login(_loginForm: FormGroup) {
    this.clearMsg();
    this.errorMsg = "";
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
      let username = _loginForm.controls.username.value;
      let password = _loginForm.controls.password.value;
      this.loginEmitter.emit({username, password});
    }
  }

}