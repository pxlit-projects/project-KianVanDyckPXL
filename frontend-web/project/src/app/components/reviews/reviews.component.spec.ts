import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReviewsComponent } from './reviews.component';
import { ReviewService } from '../../services/review.service';
import { of, throwError } from 'rxjs';
import { ReviewResponse } from '../../shared/models/reviewResponse.model';
import { ReviewComponent } from './review/review.component';
import { EventEmitter } from '@angular/core';  // <-- Add this line
describe('ReviewsComponent', () => {
  let component: ReviewsComponent;
  let fixture: ComponentFixture<ReviewsComponent>;
  let reviewService: jasmine.SpyObj<ReviewService>;

  const mockReviews: ReviewResponse[] = [
    {
      id: 1,
      title: 'Test Review 1',
      author: 'Test Author 1',
      description: 'Test Content 1',
      postId: 1,
    },
    {
      id: 2,
      title: 'Test Review 2',
      author: 'Test Author 2',
      description: 'Test Content 1',
      postId: 1,
    },
  ];

  beforeEach(async () => {
    // Create spy object for ReviewService
    const spy = jasmine.createSpyObj('ReviewService', ['getAllReviews']);
    
    await TestBed.configureTestingModule({
      imports: [ReviewsComponent, ReviewComponent],
      providers: [
        { provide: ReviewService, useValue: spy }
      ]
    }).compileComponents();

    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadReviews on initialization', () => {
      spyOn(component, 'loadReviews');
      
      component.ngOnInit();
      
      expect(component.loadReviews).toHaveBeenCalled();
    });
  });

  describe('loadReviews', () => {
    it('should load reviews successfully', fakeAsync(() => {
      reviewService.getAllReviews.and.returnValue(of(mockReviews));
      
      component.loadReviews();
      tick();
      
      expect(component.reviews).toEqual(mockReviews);
      expect(component.errorMessage).toBeNull();
    }));

    it('should handle error when loading reviews fails', fakeAsync(() => {
      reviewService.getAllReviews.and.returnValue(throwError(() => new Error('Error')));
      
      component.loadReviews();
      tick();
      
      expect(component.reviews).toEqual([]);
      expect(component.errorMessage).toBe('No reviews found.');
    }));
  });

  describe('removeReview', () => {
    beforeEach(() => {
      component.reviews = [...mockReviews];
    });

    it('should remove review from the list by id', () => {
      const reviewIdToRemove = 1;
      const expectedReviews = mockReviews.filter(review => review.id !== reviewIdToRemove);
      
      component.removeReview(reviewIdToRemove);
      
      expect(component.reviews).toEqual(expectedReviews);
      expect(component.reviews.length).toBe(mockReviews.length - 1);
    });

    it('should not modify list if review id does not exist', () => {
      const nonExistentReviewId = 999;
      
      component.removeReview(nonExistentReviewId);
      
      expect(component.reviews).toEqual(mockReviews);
      expect(component.reviews.length).toBe(mockReviews.length);
    });
  });

  describe('comment EventEmitter', () => {
    it('should have comment output event emitter', () => {
      expect(component.comment).toBeTruthy();
      expect(component.comment instanceof EventEmitter).toBe(true);
    });
  });

  describe('component integration', () => {
    it('should initialize with empty reviews array', () => {
      expect(component.reviews).toEqual([]);
    });

    it('should initialize with null error message', () => {
      expect(component.errorMessage).toBeNull();
    });
  });
});