// auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIned: boolean = false;
  private authToken: string | null = null;

  login(username: string, password: string): void {
    // Simulate a login action
    // In a real application, you'd typically make an API call to authenticate the user
    if (username === 'example' && password === 'password') {
      this.isLoggedIned = true;
      this.authToken = 'example_token'; // Replace with a token obtained from your authentication API
    }
  }

  logout(): void {
    // Simulate a logout action
    this.isLoggedIned = false;
    this.authToken = null;
  }

  isLoggedIn(): boolean {
    return this.isLoggedIned;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }
}
