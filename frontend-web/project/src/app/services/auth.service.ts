import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User | null = null;


  setUser(user: User): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));  
  }


  getUser(): User | null {
    if (!this.user) {

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

  hasRole(expectedRole: string): boolean {
    return this.user?.role === expectedRole;
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }
}
