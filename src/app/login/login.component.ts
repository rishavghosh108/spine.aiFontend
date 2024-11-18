import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopUpService } from '../pop-up.service';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private api: ApiService, private auth: AuthServiceService, private router: Router, private status: PopUpService) { }

  login = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)])
  })

  email = false;
  password = false;

  onInputChange_Email(value: any) {
    this.email = !value
  }

  onInputChange_Password(value: any) {
    this.password = !value
  }

  Login(): void {
    if (!this.login.invalid) {
      this.api.Login(this.login.value).subscribe(
        (response) => {
          if ('successful' in response.body) {
            this.auth.SetToken(response.headers.get('userauth'))
            this.status.Successful(response.body['successful'])
            this.router.navigate(['/'])
          }
        },
        (error) => {
          this.status.Error(error.error['message'])
        }
      )
    }
    else {
      this.email = this.login.get('email')?.invalid == true;
      this.password = this.login.get('password')?.invalid == true;
    }
  }
}
