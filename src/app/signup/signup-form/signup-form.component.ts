import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  public signupForm: FormGroup;
  private fnameMsg: string = '';
  private lnameMsg: string = '';
  private emailMsg: string = '';
  private usernameMsg: string = '';
  private passwordMsg: string = '';

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  @Input()
  errorMsg: string;

  @Output()
  formEmitter = new EventEmitter<any>();

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
    this.fnameMsg = "";
    this.lnameMsg = "";
    this.emailMsg = "";
    this.usernameMsg = "";
    this.passwordMsg = "";
  }

  signup(_signupForm) {
    this.clearMsg();
    this.errorMsg = "";
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
    else {
      this.formEmitter.emit(_signupForm.value);
    }
  }

}
