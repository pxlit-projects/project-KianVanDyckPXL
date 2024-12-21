import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewResponse } from '../../../shared/models/reviewResponse.model';
import { ReviewService } from '../../../services/review.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Review } from '../../../shared/models/review.model';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  @Input() review!: ReviewResponse;
  reviewForm: FormGroup;
  denyMode: boolean = false;
  @Output() reviewSubmitted = new EventEmitter<number>(); 

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.reviewForm = this.fb.group({
      comment: [''],
    });
  }

  toggleDenyMode() {
    this.denyMode = !this.denyMode;
  }


  submitReview(status: string) {

    const comment = this.reviewForm.value.comment;
    const reviewer: string = this.authService.getUser()!.name;

    const newReview: Review = new Review(comment, status, reviewer);

    this.reviewService.reviewPost(this.review.id, newReview).subscribe({
      next: () => {
        this.snackBar.open('Comment added successfully!', 'Close', { duration: 3000 });
        this.denyMode = false;
        this.reviewForm.reset();
        this.reviewSubmitted.emit(this.review.id); 
      },
      error: () => {
        this.snackBar.open('Failed to add comment.', 'Close', { duration: 3000 });
      }
    });

  }
}