import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CommentServiceService } from '../../../services/comment-service.service';
import { CommentResponse } from '../../../shared/models/commentResponse.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Post } from '../../../shared/models/post.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { Comment } from '../../../shared/models/comment.model';
import { CommentComponent } from "../../comments/comment/comment.component";



@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, DatePipe, CommentComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent {
  postId!: string | null;
  post: any;
  comments: CommentResponse[] = [];
  errorMessage: string | null = null;

  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 2;
  fb: FormBuilder = inject(FormBuilder);
  @Output() comment = new EventEmitter<Post>();

  commentForm: FormGroup = this.fb.group({
    comment: ['', [Validators.required]],
  });
  authService: AuthService = inject(AuthService);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private CommentService : CommentServiceService
  ) {
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {

      this.loadPost(this.postId)
      this.loadComments(this.postId)

    } else {

      this.router.navigate(['/']);
    }
  }

  loadPost(postId: string): void {
    this.postService.getPostById(+postId).subscribe({
      next: (data) => {
        this.post = data;
      },
      error: (err) => {
        console.error('Error fetching post:', err);
        this.errorMessage = 'Post not found.';
      },
    });
  }

  loadComments(postId: string): void {
    this.CommentService.getAllCommentsByPost(+postId).subscribe({
      next: (data) => {
        this.comments = data;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      }
    });
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const commentData = this.commentForm.value;
      const author = this.authService.getUser()?.name

      if (author && this.postId) {
        const comment: Comment = new Comment( commentData.comment , author, this.postId);
        this.CommentService.addComment(comment).subscribe({
          next: (response) => {
            this.loadComments(this.postId!)
            this._snackBar.open('Comment created successfully!', 'Close', {
              duration: this.durationInSeconds * 1000, 
            });

          },
          error: (error) => {
            this._snackBar.open('Failed to create Comment. Please try again.', 'Close', {
              duration: this.durationInSeconds * 1000,
            });
          },
        });
      }
    }
  }
}


