import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { PostResponse } from '../../../shared/models/postResponse.model';
import { DatePipe } from '@angular/common';
import { PostCardComponent } from '../post-card/post-card/post-card.component';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockPosts: PostResponse[] = [
    { id: 1, title: 'First', content: 'Content of post 1', author: 'Jane', createdAt: new Date().toISOString(), isConcept: false, comment: "no", reviewStatus: "PENDING" },
    { id: 2, title: 'Second Post', content: 'Content of second', author: 'user1', createdAt: new Date(12, 0, 2).toDateString(), isConcept: false, comment: "no", reviewStatus: "PENDING" },
  ];



  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getAllPublishedPosts']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        PostListComponent,
        FormsModule,
        DatePipe,
        PostCardComponent
      ],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty arrays and default filter values', () => {
      expect(component.posts).toEqual([]);
      expect(component.filteredPosts).toEqual([]);
      expect(component.searchTerm).toBe('');
      expect(component.author).toBe('');
      expect(component.startDate).toBeNull();
      expect(component.endDate).toBeNull();
    });
  });

  describe('loadPosts', () => {
    it('should load posts successfully', fakeAsync(() => {
      postService.getAllPublishedPosts.and.returnValue(of(mockPosts));
      
      component.loadPosts();
      tick();
      
      expect(component.posts).toEqual(mockPosts);
      expect(component.filteredPosts).toEqual(mockPosts);
    }));

    it('should handle error when loading posts fails', fakeAsync(() => {
      const consoleError = spyOn(console, 'error');
      postService.getAllPublishedPosts.and.returnValue(throwError(() => new Error('Error')));
      
      component.loadPosts();
      tick();
      
      expect(consoleError).toHaveBeenCalledWith('Error fetching posts:', jasmine.any(Error));
    }));
  });

  describe('applyFilter', () => {
    beforeEach(() => {
      component.posts = mockPosts;
      component.filteredPosts = [...mockPosts];
    });

    it('should filter by search term in title', () => {
      component.searchTerm = 'First';
      component.applyFilter();
      
      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].title).toContain('First');
    });

    it('should filter by search term in content', () => {
      component.searchTerm = 'Content of second';
      component.applyFilter();
      
      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].title).toBe('Second Post');
    });

    it('should filter by author', () => {
      component.author = 'Jane';
      component.applyFilter();
      
      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].author).toContain('Jane');
    });


  });

  describe('checkDateRange', () => {
    it('should return true when no dates are set', () => {
      const result = component.checkDateRange(new Date());
      expect(result).toBeTrue();
    });

    it('should check only start date when end date is null', () => {
      component.startDate = '2024-01-10';
      const beforeStart = new Date('2024-01-09');
      const afterStart = new Date('2024-01-11');
      
      expect(component.checkDateRange(beforeStart)).toBeFalse();
      expect(component.checkDateRange(afterStart)).toBeTrue();
    });

    it('should check only end date when start date is null', () => {
      component.endDate = '2024-01-10';
      const beforeEnd = new Date('2024-01-09');
      const afterEnd = new Date('2024-01-11');
      
      expect(component.checkDateRange(beforeEnd)).toBeTrue();
      expect(component.checkDateRange(afterEnd)).toBeFalse();
    });
  });

  describe('Date Utility Methods', () => {
    it('should set time to start of day', () => {
      const date = new Date('2024-01-15T15:30:45');
      const result = component.setToStartOfDay(date);
      
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should set time to end of day', () => {
      const date = new Date('2024-01-15T15:30:45');
      const result = component.setToEndOfDay(date);
      
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('clearFilters', () => {
    it('should reset all filters and restore original posts', () => {
      component.posts = mockPosts;
      component.searchTerm = 'test';
      component.author = 'John';
      component.startDate = '2024-01-01';
      component.endDate = '2024-01-31';
      
      component.clearFilters();
      
      expect(component.searchTerm).toBe('');
      expect(component.author).toBe('');
      expect(component.startDate).toBeNull();
      expect(component.endDate).toBeNull();
      expect(component.filteredPosts).toEqual(mockPosts);
    });
  });
});