import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CommentServiceService } from '../../../services/comment-service.service';
import { CommentResponse } from '../../../shared/models/commentResponse.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth.service';
import { Comment } from '../../../shared/models/comment.model';
import { CommentComponent } from "../../comments/comment/comment.component";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, DatePipe, CommentComponent, MatButtonModule],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent {
  postId!: string | null;
  post: Post | null = null;
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
    private commentService: CommentServiceService
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.loadPost(this.postId);
      this.loadComments(this.postId);
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
    this.commentService.getAllCommentsByPost(+postId).subscribe({
      next: (data) => {
        this.comments = data;
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      const commentData = this.commentForm.value;
      const author = this.authService.getUser()?.name;

      if (author && this.postId) {
        const comment: Comment = new Comment(commentData.comment, author, this.postId);
        this.commentService.addComment(comment).subscribe({
          next: () => {
            this.loadComments(this.postId!);
            this._snackBar.open('Comment created successfully!', 'Close', {
              duration: this.durationInSeconds * 1000,
            });
          },
          error: () => {
            this._snackBar.open('Failed to create comment. Please try again.', 'Close', {
              duration: this.durationInSeconds * 1000,
            });
          },
        });
      }
    }
  }

  removeComment(commentId: number): void {
    this.comments = this.comments.filter(comment => comment.id !== commentId);
  }
}