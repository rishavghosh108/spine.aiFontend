import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { PopUpService } from '../pop-up.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  constructor(private api: ApiService, private status: PopUpService, private router: Router) { }

  signup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
    ])
  });

  name = false;
  email = false;
  password = false;

  onInputChange_Name(value: any) {
    this.name = !value
  }

  onInputChange_Email(value: any) {
    this.email = !value
  }

  onInputChange_Password(value: any) {
    this.password = !value
  }

  Signup() {
    if (!this.signup.invalid) {
      this.api.Signup(this.signup.value).subscribe(
        response => {
          if ('successful' in response.body) {
            this.status.Successful(response.body['successful'])
            this.router.navigate(['/login'])
          }
        },
        error => {
          console.log(error.body);

          console.log(error.error['message'])
          this.status.Error(error.error['message'])
        }
      )
    }
    else {
      this.name = this.signup.get('name')?.invalid == true;
      this.email = this.signup.get('email')?.invalid == true;
      this.password = this.signup.get('password')?.invalid == true;
    }
  }
}
