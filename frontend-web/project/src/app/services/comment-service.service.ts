
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { CommentResponse } from '../shared/models/commentResponse.model';
import { Comment } from '../shared/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentServiceService {

  api: string = 'http://localhost:8082/api/comment';
  http: HttpClient = inject(HttpClient);


  getAllCommentsByPost(postId : number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.api}/${postId}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.api, comment).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  updateComment(commentId: number, updatedComment: string): Observable<void> {
    return this.http.put<void>(`${this.api}/${commentId}`, { comment: updatedComment }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }


  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${commentId}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}