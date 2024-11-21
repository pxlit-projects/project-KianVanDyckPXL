import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PostResponse } from '../../../shared/models/postResponse.model';
import { AuthService } from '../../../services/auth.service';
import { Post } from '../../../shared/models/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCheckboxModule],
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent {
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 2;
  editForm: FormGroup;
  postId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
  ) {
    // Initialize the form
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      isConcept: [false], // Matches the checkbox behavior
    });
  }

  ngOnInit(): void {

    this.postId = +this.route.snapshot.paramMap.get('id')!;

    this.postService.getPostById(this.postId).subscribe((post: PostResponse) => {
      this.editForm.patchValue({
        title: post.title,
        content: post.content,
        isConcept: post.isConcept, // Ensure it is a boolean
      });

    });
    
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const postData = this.editForm.value;
      const author = this.authService.getUser()?.name

      if (author) {
        const post: Post = new Post(postData.title, postData.content, author, postData.isConcept);
        this.postService.updatePost(this.postId,post).subscribe({
          next: (response) => {
            this._snackBar.open('Post created successfully!', 'Close', {
              duration: this.durationInSeconds * 1000, // duration in milliseconds
            });
            this.router.navigate(['/author-list']);
          },
          error: (error) => {
            this._snackBar.open('Failed to create post. Please try again.', 'Close', {
              duration: this.durationInSeconds * 1000,
            });
          },
        });
      }
    }
  }
}