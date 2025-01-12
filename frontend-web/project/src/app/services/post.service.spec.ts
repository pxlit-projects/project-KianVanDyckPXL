import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { AuthService } from './auth.service';
import { PostResponse } from '../shared/models/postResponse.model';
import { Post } from '../shared/models/post.model';
import { of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostService,
        { provide: AuthService, useValue: { getUser: () => ({ role: 'USER' }) } },
      ]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add a new post', () => {
    const newPost: Post = { title: 'New Post', content: 'This is a new post.', author : 'user1', isConcept: false };
    const mockResponse: Post = { title: 'New Post', content: 'This is a new post.', author : 'user1', isConcept: false };

    service.addPost(newPost).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service.api);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    req.flush(mockResponse);
  });

  it('should get all published posts', () => {
    const mockPosts: PostResponse[] = [
      { id: 1, title: 'Post 1', content: 'Content of post 1', author: 'user1', createdAt: new Date().toISOString(), isConcept: false, comment: "no", reviewStatus: "PENDING" },
      { id: 2, title: 'Post 1', content: 'Content of post 1', author: 'user1', createdAt: new Date().toISOString(), isConcept: false, comment: "no", reviewStatus: "PENDING" }
    ];

    service.getAllPublishedPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(service.api);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should get posts by author', () => {
    const author = 'user1';
    const mockPosts: PostResponse[] = [
      { id: 1, title: 'Post 1', content: 'Content of post 1', author: 'user1', createdAt: new Date().toISOString(), isConcept: false, comment: "no", reviewStatus: "PENDING" }
    ];

    service.getPostsByAuthor(author).subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${service.api}/author/${author}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should get post by ID', () => {
    const postId = 1;
    const mockPost: PostResponse = { id: 1, title: 'Post 1', content: 'Content of post 1', author: 'user1', createdAt: new Date().toISOString(), isConcept: false, comment: "no", reviewStatus: "PENDING" };

    service.getPostById(postId).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${service.api}/${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should update a post', () => {
    const postId = 1;
    const updatedPost: Post = { title: 'New Post', content: 'This is a new post.', author : 'user1', isConcept: false };
    const mockResponse: Post = { title: 'New Post', content: 'This is a new post.', author : 'user1', isConcept: false };

    service.updatePost(postId, updatedPost).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.api}/${postId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPost);
    req.flush(mockResponse);
  });

  it('should handle error when adding a post', () => {
    const newPost: Post = { title: 'New Post', content: 'This is a new post.', author : 'user1', isConcept: false };

    service.addPost(newPost).subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(service.api);
    req.error(new ErrorEvent('Network error'));
  });
});
