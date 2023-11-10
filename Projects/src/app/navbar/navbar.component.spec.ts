// navbar.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-navbar',
  template: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn: boolean;
  authService: any;

  constructor( authService: AuthService) {
    // Initialize isLoggedIn based on the user's authentication status from your AuthService
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout() {
    // Call your authentication service's logout method
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
