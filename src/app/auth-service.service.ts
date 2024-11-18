import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private cookie: CookieService) { }

  SetToken(token: string): void {
    const exp_time = new Date();
    exp_time.setTime(exp_time.getTime() + 1 * 60 * 60 * 1000);
    this.cookie.set('Authentication', token, exp_time);
  }

  GetToken(): string {
    return this.cookie.get('Authentication');
  }

  RemoveToken(): void {
    this.cookie.delete('Authentication')
  }
}
