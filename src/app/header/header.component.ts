import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) { }
  currentPath = this.router.url;

  onAddClick() {
    this.router.navigate(['/add']);
  }

  onListClick() {
    this.router.navigate(['/list']);
  }

  profile: boolean = false;

  Profile() {
    this.profile = !this.profile;
  }
}
