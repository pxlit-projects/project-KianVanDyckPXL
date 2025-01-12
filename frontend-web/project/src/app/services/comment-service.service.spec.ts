import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentServiceService } from './comment-service.service';
import { AuthService } from './auth.service';
import { CommentResponse } from '../shared/models/commentResponse.model';
import { Comment } from '../shared/models/comment.model';
import { of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

describe('CommentServiceService', () => {
  let service: CommentServiceService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommentServiceService,
        { provide: AuthService, useValue: { getUser: () => ({ role: 'USER' }) } },
      ]
    });
    service = TestBed.inject(CommentServiceService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all comments by postId', () => {
    const mockComments: CommentResponse[] = [
      { id: 1, postId: 1, comment: 'Great post!', author: 'User1' },
      { id: 2, postId: 1, comment: 'Very informative.', author: 'User2' }
    ];

    service.getAllCommentsByPost(1).subscribe(comments => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${service.api}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('should add a new comment', () => {
    const newComment: Comment = { postId: "1", comment: 'Great article!', author: "User1" };
    const mockResponse: Comment = {postId: "1", comment: 'Great article!' , author: "User1"};

    service.addComment(newComment).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service.api);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newComment);
    req.flush(mockResponse);
  });

  it('should update an existing comment', () => {
    const updatedComment = 'Updated comment content';
    const commentId = 1;

    service.updateComment(commentId, updatedComment).subscribe();

    const req = httpMock.expectOne(`${service.api}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ comment: updatedComment });
    req.flush({});
  });

  it('should delete a comment', () => {
    const commentId = 1;

    service.deleteComment(commentId).subscribe();

    const req = httpMock.expectOne(`${service.api}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle error in addComment', () => {
    const newComment: Comment = { postId: "1", comment: 'Great article!' , author: 'User1'};

    service.addComment(newComment).subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(service.api);
    req.error(new ErrorEvent('Network error'));
  });
});
