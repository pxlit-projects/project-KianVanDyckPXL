import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReviewComponent } from './review.component';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Review } from '../../../shared/models/review.model';
import { MatButtonModule } from '@angular/material/button';
import { ReviewResponse } from '../../../shared/models/reviewResponse.model';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'reviewer'
  };

  const mockReview: Review = new Review('Test comment', 'approved', 'Test User');
  
  const mockReviewResponse: ReviewResponse = {
    id: 1,
    title: 'Test Review',
    author: 'Test Author',
    description: 'Test Content',
    postId: 1
  };

  beforeEach(async () => {
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['reviewPost']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReviewComponent,
        ReactiveFormsModule,
        MatButtonModule
      ],
      providers: [
        FormBuilder,
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    component.review = mockReviewResponse;
    authService.getUser.and.returnValue(mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      expect(component.denyMode).toBeFalse();
      expect(component.reviewForm.get('comment')?.value).toBe('');
    });

    it('should have review input set', () => {
      expect(component.review).toEqual(mockReviewResponse);
    });
  });

  describe('toggleDenyMode', () => {
    it('should toggle denyMode value', () => {
      expect(component.denyMode).toBeFalse();
      
      component.toggleDenyMode();
      expect(component.denyMode).toBeTrue();
      
      component.toggleDenyMode();
      expect(component.denyMode).toBeFalse();
    });
  });

  describe('submitReview', () => {
    const testComment = 'Test comment';
    const testStatus = 'approved';

    beforeEach(() => {
      component.reviewForm.patchValue({ comment: testComment });
    });

    it('should create and submit new review with correct data', fakeAsync(() => {
      const expectedReview: Review = new Review(testComment, testStatus, mockUser.name);
      reviewService.reviewPost.and.returnValue(of(mockReview));

      component.submitReview(testStatus);
      tick();

      expect(reviewService.reviewPost).toHaveBeenCalledWith(mockReviewResponse.id, expectedReview);
    }));


    it('should emit reviewSubmitted event with review ID on successful submission', fakeAsync(() => {
      reviewService.reviewPost.and.returnValue(of(mockReview));
      spyOn(component.reviewSubmitted, 'emit');
      
      component.submitReview(testStatus);
      tick();

      expect(component.reviewSubmitted.emit).toHaveBeenCalledWith(mockReviewResponse.id);
    }));

  });

  describe('Form Validation', () => {
    it('should initialize with valid form', () => {
      expect(component.reviewForm.valid).toBeTrue();
    });

    it('should allow empty comment', () => {
      component.reviewForm.patchValue({ comment: '' });
      expect(component.reviewForm.valid).toBeTrue();
    });

    it('should update form value when comment is entered', () => {
      const testComment = 'New comment';
      component.reviewForm.patchValue({ comment: testComment });
      
      expect(component.reviewForm.get('comment')?.value).toBe(testComment);
    });
  });

  describe('Integration with Dependencies', () => {
    it('should call authService.getUser when submitting review', fakeAsync(() => {
      reviewService.reviewPost.and.returnValue(of(mockReview));
      
      component.submitReview('approved');
      tick();

      expect(authService.getUser).toHaveBeenCalled();
    }));

    it('should use MatSnackBar with correct configuration', fakeAsync(() => {
      reviewService.reviewPost.and.returnValue(of(mockReview));
      
      component.submitReview('approved');
      tick();

      expect(snackBar.open).toHaveBeenCalledWith(
        jasmine.any(String),
        'Close',
        { duration: 3000 }
      );
    }));
  });
});
