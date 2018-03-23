import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class isNotAuthGuard implements CanActivate{

  constructor(private _userService: UserService, private _router: Router) {
    }

    canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
      return this._userService.isLoggedIn().map(res => {
          if (!res.authenticated) {
            //if user is not logged in
            return true;
          }
          else {
            //if user is logged in
            this._router.navigate(['/home']);
            return false;
          }
      }).catch(() => {
          this._router.navigate(['/home']);
          return Observable.of(false);
      });
  }   

}
