import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostCreateComponent } from './post-create.component';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Post } from '../../../shared/models/post.model';
import { of, throwError } from 'rxjs';

describe('PostCreateComponent', () => {
  let component: PostCreateComponent;
  let fixture: ComponentFixture<PostCreateComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;



  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'author'
  };
  const mockPost = new Post('Test Title', 'Test Content', mockUser.name, false);
  const mockForm = {
    valid: true,
    resetForm: jasmine.createSpy('resetForm')
  } as any as NgForm;

  beforeEach(async () => {
    postServiceSpy = jasmine.createSpyObj('PostService', ['addPost']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        PostCreateComponent,
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty model', () => {
      expect(component.model).toEqual({
        title: '',
        content: '',
        conceptCheckbox: false
      });
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      authServiceSpy.getUser.and.returnValue(mockUser);
    });

    it('should create post when form is valid', fakeAsync(() => {
      // Arrange
      const expectedPost = new Post('Test Title', 'Test Content', mockUser.name, false);
      postServiceSpy.addPost.and.returnValue(of(mockPost));
      
      component.model = {
        title: 'Test Title',
        content: 'Test Content',
        conceptCheckbox: false
      };

      // Spy on event emitter
      spyOn(component.postCreated, 'emit');

      // Act
      component.onSubmit(mockForm);
      tick();

      // Assert
      expect(postServiceSpy.addPost).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Test Title',
        content: 'Test Content',
        author: mockUser.name,
        isConcept: false
      }));
      expect(component.postCreated.emit).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Post created successfully!',
        'Close',
        { duration: 2000 }
      );
      expect(mockForm.resetForm).toHaveBeenCalled();
    }));

    it('should not create post when form is invalid', () => {
      // Arrange
      const invalidForm = { valid: false } as NgForm;

      // Act
      component.onSubmit(invalidForm);

      // Assert
      expect(postServiceSpy.addPost).not.toHaveBeenCalled();
      expect(snackBarSpy.open).not.toHaveBeenCalled();
    });

    it('should handle error when post creation fails', fakeAsync(() => {
      // Arrange
      postServiceSpy.addPost.and.returnValue(throwError(() => new Error('Creation failed')));
      component.model = {
        title: 'Test Title',
        content: 'Test Content',
        conceptCheckbox: false
      };

      // Act
      component.onSubmit(mockForm);
      tick();

      // Assert
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Failed to create post. Please try again.',
        'Close',
        { duration: 2000 }
      );
      expect(mockForm.resetForm).not.toHaveBeenCalled();
    }));

    it('should not create post when user is not authenticated', () => {
      // Arrange
      authServiceSpy.getUser.and.returnValue(null);

      // Act
      component.onSubmit(mockForm);

      // Assert
      expect(postServiceSpy.addPost).not.toHaveBeenCalled();
      expect(snackBarSpy.open).not.toHaveBeenCalled();
    });
  });

  describe('Form Reset', () => {
    it('should reset form and model', () => {
      // Arrange
      component.model = {
        title: 'Test Title',
        content: 'Test Content',
        conceptCheckbox: true
      };

      // Act
      component['resetForm'](mockForm);

      // Assert
      expect(component.model).toEqual({
        title: '',
        content: '',
        conceptCheckbox: false
      });
      expect(mockForm.resetForm).toHaveBeenCalled();
    });
  });

  describe('Event Emission', () => {
    it('should emit postCreated event with new post', fakeAsync(() => {
      // Arrange
      const expectedPost = new Post('Test Title', 'Test Content', mockUser.name, false);
      postServiceSpy.addPost.and.returnValue(of(mockPost));
      spyOn(component.postCreated, 'emit');

      component.model = {
        title: 'Test Title',
        content: 'Test Content',
        conceptCheckbox: false
      };

      // Act
      component.onSubmit(mockForm);
      tick();

      // Assert
      expect(component.postCreated.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Test Title',
          content: 'Test Content',
          author: mockUser.name,
          isConcept: false
        })
      );
    }));
  });
});