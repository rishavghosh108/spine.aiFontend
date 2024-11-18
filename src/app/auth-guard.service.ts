import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private cookie: CookieService) { }

  canActivate(): boolean {
    const token = this.cookie.get('Authentication')
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login'])
      return false;
    }
  }
}
