import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  @Output() login = new EventEmitter<User>();

  loginForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    role: ['', [Validators.required]],
  });

  authService: AuthService = inject(AuthService);

  ngOnInit() {

    const currentUser = this.authService.getUser();
    if (currentUser) {
      this.router.navigate(['/add-post']); 
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { name, role } = this.loginForm.value;
      const user: User = { name, role };
      this.authService.setUser(user);
      this.login.emit(user);

      this.router.navigate(['/add-post']);
    }
  }
}
