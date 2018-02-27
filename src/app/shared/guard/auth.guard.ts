import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {

  }

  canActivate() {
    // disable now
    if (localStorage.getItem('isLoggedin')) {
      return true;
    }else {
      return false;
    }
    // this.router.navigate(['/login']);
  }
}
