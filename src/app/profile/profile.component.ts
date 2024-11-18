import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ParseSourceFile } from '@angular/compiler';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  headers: HttpHeaders;

  constructor(private auth: AuthServiceService, private api: ApiService) {
    this.headers = new HttpHeaders({ 'userauth': this.auth.GetToken() })

    if (api.name == null || api.email == null) {
      api.Profile(this.headers).subscribe(
        (response) => {
          if (response.body) {
            this.name = response.body['successful']['name']
            api.name = response.body['successful']['name']

            this.email = response.body['successful']['email']
            api.email = response.body['successful']['email']
          }
        }
      )
    } else {
      this.name = api.name;
      this.email = api.email;
    }
  }



  name!: string;
  email!: string;

  LogOut() {
    this.auth.RemoveToken()
    window.location.reload();
  }
}
