import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { AuthService } from './auth.service';
import { ReviewResponse } from '../shared/models/reviewResponse.model';
import { Review } from '../shared/models/review.model';
import { HttpHeaders } from '@angular/common/http';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReviewService,
        { provide: AuthService, useValue: { getUser: () => ({ role: 'USER' }) } },
      ]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all reviews', () => {
    const mockReviews: ReviewResponse[] = [
      { id: 1, author: 'user1', description: 'Good post!', title: 'Post 1', postId: 1 },
      { id: 2, author: 'user1', description: 'Good post!', title: 'Post 2', postId: 1 },
    ];

    service.getAllReviews().subscribe(reviews => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(service.api);
    expect(req.request.method).toBe('GET');
    req.flush(mockReviews);
  });

  it('should post a review for a post', () => {
    const reviewId = 1;
    const newReview: Review = { reviewer: "user1", comment: 'Good post!', status: "APPROVED" };
    const mockResponse: Review = { reviewer: "user1", comment: 'Good post!', status: "APPROVED" };

    service.reviewPost(reviewId, newReview).subscribe(response => {
      expect(response).toEqual(newReview);
    });

    const req = httpMock.expectOne(`${service.api}/${reviewId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newReview);
    req.flush(mockResponse);
  });

  it('should handle error when posting a review', () => {
    const reviewId = 1;
    const newReview: Review = { reviewer: "user1", comment: 'Good post!', status: "APPROVED" };

    service.reviewPost(reviewId, newReview).subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${service.api}/${reviewId}`);
    req.error(new ErrorEvent('Network error'));
  });
});
