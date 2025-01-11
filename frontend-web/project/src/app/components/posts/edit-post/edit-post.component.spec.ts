import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPostComponent } from './edit-post.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Post } from '../../../shared/models/post.model';
import { PostResponse } from '../../../shared/models/postResponse.model';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockPost: PostResponse = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    author: 'John Doe',
    isConcept: false,
    createdAt: new Date().toISOString(),
    reviewStatus: 'pending',
    comment: "Comment 1"
  };

  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'author'
  };

  beforeEach(async () => {
    // Create spies for all required services
    postServiceSpy = jasmine.createSpyObj('PostService', ['getPostById', 'updatePost']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        EditPostComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule
      ],
      providers: [
        FormBuilder,
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty values', () => {
      expect(component.editForm.get('title')).toBeTruthy();
      expect(component.editForm.get('content')).toBeTruthy();
      expect(component.editForm.get('isConcept')).toBeTruthy();
      expect(component.editForm.get('title')?.value).toBe('');
      expect(component.editForm.get('content')?.value).toBe('');
      expect(component.editForm.get('isConcept')?.value).toBe(false);
    });

    it('should load post data on init', () => {
      // Arrange
      postServiceSpy.getPostById.and.returnValue(of(mockPost));

      // Act
      component.ngOnInit();
      fixture.detectChanges();

      // Assert
      expect(postServiceSpy.getPostById).toHaveBeenCalledWith(1);
      expect(component.editForm.get('title')?.value).toBe(mockPost.title);
      expect(component.editForm.get('content')?.value).toBe(mockPost.content);
      expect(component.editForm.get('isConcept')?.value).toBe(mockPost.isConcept);
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.editForm.valid).toBeFalsy();
    });

    it('should be valid when all required fields are filled', () => {
      component.editForm.patchValue({
        title: 'Test Title',
        content: 'Test Content',
        isConcept: false
      });
      expect(component.editForm.valid).toBeTruthy();
    });

    it('should require title', () => {
      const titleControl = component.editForm.get('title');
      expect(titleControl?.valid).toBeFalsy();
      expect(titleControl?.errors?.['required']).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      authServiceSpy.getUser.and.returnValue(mockUser);
    });

    it('should submit successfully when form is valid', () => {
      // Arrange
      component.editForm.patchValue({
        title: 'Test Title',
        content: 'Test Content',
        isConcept: false
      });
      postServiceSpy.updatePost.and.returnValue(of(mockPost));

      // Act
      component.onSubmit();

      // Assert
      expect(postServiceSpy.updatePost).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Post created successfully!',
        'Close',
        jasmine.any(Object)
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/author-list']);
    });

    it('should show error message when submission fails', () => {
      // Arrange
      component.editForm.patchValue({
        title: 'Test Title',
        content: 'Test Content',
        isConcept: false
      });
      postServiceSpy.updatePost.and.returnValue(throwError(() => new Error('Update failed')));

      // Act
      component.onSubmit();

      // Assert
      expect(postServiceSpy.updatePost).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Failed to create post. Please try again.',
        'Close',
        jasmine.any(Object)
      );
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should not submit when form is invalid', () => {
      // Act
      component.onSubmit();

      // Assert
      expect(postServiceSpy.updatePost).not.toHaveBeenCalled();
      expect(snackBarSpy.open).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });
});