import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorAuthGuardService {


  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {

    if (this.authService.isLoggedIn() && this.authService.hasRole("editor")) {
      return true; 
    } else {
      this.router.navigate(['/login']);
      return false; 
    }
  }
}