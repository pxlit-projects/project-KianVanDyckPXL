import { Component, EventEmitter, Output } from '@angular/core';
import { ReviewResponse } from '../../shared/models/reviewResponse.model';
import { ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from "./review/review.component";
import { Review } from '../../shared/models/review.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, ReviewComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  errorMessage: string | null = null;
  reviews: ReviewResponse[] = []

  @Output() comment = new EventEmitter<Review>();

  constructor(
    private reviewService: ReviewService
  ) {
  }

  ngOnInit(): void {
    this.loadReviews();
  }


  loadReviews() {
    this.reviewService.getAllReviews().subscribe({
      next: (data)=> {
        this.reviews = data;
      },
      error:(err) => {
        this.errorMessage = "No reviews found.";
      }
    });
  }

  removeReview(reviewId: number) {
    this.reviews = this.reviews.filter(review => review.id !== reviewId);
  }
}
