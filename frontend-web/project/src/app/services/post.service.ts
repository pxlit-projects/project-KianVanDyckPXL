import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { PostResponse } from '../shared/models/postResponse.model';
import { Post } from '../shared/models/post.model';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class PostService {
  api: string = 'http://localhost:8093/post/api/post';
  http: HttpClient = inject(HttpClient);

  authService: AuthService = inject(AuthService);

  private getHeaders(): HttpHeaders {
    const user = this.authService.getUser();
    const roleHeader = user ? user.role : 'GUEST';
    return new HttpHeaders({
      'Role': roleHeader
    });
  }


  addPost(post: Post): Observable<Post> {
    const headers = this.getHeaders();
    return this.http.post<Post>(this.api, post, {headers}).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  getAllPublishedPosts(): Observable<PostResponse[]> {
    const headers = this.getHeaders();

    return this.http.get<PostResponse[]>(this.api, {headers});
  }

  getPostsByAuthor(author: string): Observable<PostResponse[]> {
    const headers = this.getHeaders();
    return this.http.get<PostResponse[]>(`${this.api}/author/${author}`, {headers});
  }

  getPostById(id: number): Observable<PostResponse> {
    const headers = this.getHeaders();
    return this.http.get<PostResponse>(`${this.api}/${id}`, {headers});
  }


  updatePost(id: number,post: Post): Observable<Post> {
    const headers = this.getHeaders();
    return this.http.put<Post>(`${this.api}/${id}`, post, {headers}).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}