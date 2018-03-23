import { Component, Input, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { UserService } from '../services/user.service';

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
      private _router: Router,
      private ngRedux: NgRedux<IAppState>
    ) {}
  
    ngOnInit(){
      this.checkAuthentication();
    }
  
    loggedIn: boolean = false;
    title: string = 'Bullion Coins Store';
  
    @Input() totalQuantity: number;   //gets the total quantity from the parent
  
    checkAuthentication(){
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
