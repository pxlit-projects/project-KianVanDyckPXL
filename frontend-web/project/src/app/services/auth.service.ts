import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User | null = null;

  // Set user details
  setUser(user: User): void {
    this.user = user;
    // You could also store this in localStorage/sessionStorage for persistence
    localStorage.setItem('user', JSON.stringify(user));  // Optional for persistence
  }

  // Get user details
  getUser(): User | null {
    if (!this.user) {
      // Load user from localStorage if available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }
    return this.user;
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem('user');  // Remove from storage on logout
  }
}
