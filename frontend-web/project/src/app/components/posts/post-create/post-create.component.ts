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
  durationInSeconds = 2;

  fb: FormBuilder = inject(FormBuilder);
  @Output() post = new EventEmitter<Post>();

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', [Validators.required]],
    conceptCheckbox: [false]
  });

  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);


  onSubmit() {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
      const author = this.authService.getUser()?.name

      if (author) {
        const post: Post = new Post(postData.title, postData.content, author, postData.conceptCheckbox);
        this.postService.addPost(post).subscribe({
          next: (response) => {
            this._snackBar.open('Post created successfully!', 'Close', {
              duration: this.durationInSeconds * 1000, // duration in milliseconds
            });
          },
          error: (error) => {
            this._snackBar.open('Failed to create post. Please try again.', 'Close', {
              duration: this.durationInSeconds * 1000,
            });
          },
        });
      } else {
        console.log('Form is invalid');
      }
    }
  }
}