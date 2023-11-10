// login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  authService: any;

  constructor(authService: AuthService) {}

  login(): void {
    if (this.username && this.password) {
      // Call the login method of AuthService
      this.authService.login(this.username, this.password);

      // Check if login was successful
      if (this.authService.isLoggedIn()) {
        // Redirect to home or any other page
        console.log('Login successful');
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
}
