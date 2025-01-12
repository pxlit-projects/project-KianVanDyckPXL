
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { CommentResponse } from '../shared/models/commentResponse.model';
import { Comment } from '../shared/models/comment.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentServiceService {

  api: string = environment.commentApiUrl;
  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  private getHeaders(): HttpHeaders {
    const user = this.authService.getUser();
    const roleHeader = user ? user.role : 'GUEST';
    return new HttpHeaders({
      'Role': roleHeader
    });
  }

  getAllCommentsByPost(postId : number): Observable<CommentResponse[]> {
    const headers = this.getHeaders();
    return this.http.get<CommentResponse[]>(`${this.api}/${postId}`, { headers });
  }

  addComment(comment: Comment): Observable<Comment> {
    const headers = this.getHeaders();
    return this.http.post<Comment>(this.api, comment, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  updateComment(commentId: number, updatedComment: string): Observable<void> {
    const headers = this.getHeaders();
    return this.http.put<void>(`${this.api}/${commentId}`, { comment: updatedComment }, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }


  deleteComment(commentId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.api}/${commentId}`,  { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}