import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PostResponse } from '../../../shared/models/postResponse.model';
import { User } from '../../../shared/models/user.model';
import { AuthorPostListComponent } from './author-post-list.component';

describe('AuthorPostListComponent', () => {
  let component: AuthorPostListComponent;
  let fixture: ComponentFixture<AuthorPostListComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPosts: PostResponse[] = [
    {
      id: 1,
      title: 'Test Post 1',
      content: 'Content 1',
      author: 'John Doe',
      createdAt: new Date().toISOString(),
      isConcept: false,
      reviewStatus: 'approved',
      comment: "Comment 1"
    },
    {
      id: 2,
      title: 'Test Post 2',
      content: 'Content 2',
      author: 'John Doe',
      createdAt: new Date().toISOString(),
      isConcept: true,
      reviewStatus: 'pending',
    comment: "Comment 1"
    }
  ];

  const mockUser: User = {
    name: 'John Doe',
    role: 'author'
  };

  beforeEach(async () => {
    // Create spies for all required services
    postServiceSpy = jasmine.createSpyObj('PostService', ['getPostsByAuthor']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AuthorPostListComponent, DatePipe],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorPostListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch posts when user is authenticated', () => {
      // Arrange
      authServiceSpy.getUser.and.returnValue(mockUser);
      postServiceSpy.getPostsByAuthor.and.returnValue(of(mockPosts));

      // Act
      component.ngOnInit();
      fixture.detectChanges();

      // Assert
      expect(authServiceSpy.getUser).toHaveBeenCalled();
      expect(postServiceSpy.getPostsByAuthor).toHaveBeenCalledWith(mockUser.name);
      expect(component.posts).toEqual(mockPosts);
    });

    it('should redirect to login when user is not authenticated', () => {
      // Arrange
      authServiceSpy.getUser.and.returnValue(null);

      // Act
      component.ngOnInit();
      fixture.detectChanges();

      // Assert
      expect(authServiceSpy.getUser).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      expect(postServiceSpy.getPostsByAuthor).not.toHaveBeenCalled();
    });
  });

  describe('editPost', () => {
    it('should navigate to edit post page with correct postId', () => {
      // Arrange
      const postId = 1;

      // Act
      component.editPost(postId);

      // Assert
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/edit-post', postId]);
    });
  });

});