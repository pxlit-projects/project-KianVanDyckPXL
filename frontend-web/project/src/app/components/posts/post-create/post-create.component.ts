import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Post } from '../../../shared/models/post.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent {
  private _snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private postService = inject(PostService);

  @Output() postCreated = new EventEmitter<Post>();

  // Model for the form
  model = {
    title: '',
    content: '',
    conceptCheckbox: false
  };

  onSubmit(form: any) {
    if (form.valid) {
      const author = this.authService.getUser()?.name;

      if (author) {
        const newPost = new Post(
          this.model.title,
          this.model.content,
          author,
          this.model.conceptCheckbox
        );

        this.postService.addPost(newPost).subscribe({
          next: (response) => {
            this._snackBar.open('Post created successfully!', 'Close', {
              duration: 2000,
            });
            this.postCreated.emit(newPost);
            this.resetForm(form);
          },
          error: (error) => {
            this._snackBar.open('Failed to create post. Please try again.', 'Close', {
              duration: 2000,
            });
          },
        });
      }
    }
  }

  private resetForm(form: any) {
    this.model = {
      title: '',
      content: '',
      conceptCheckbox: false
    };
    form.resetForm();
  }
}