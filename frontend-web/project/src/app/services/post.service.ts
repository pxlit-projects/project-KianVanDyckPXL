import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { PostResponse } from '../shared/models/postResponse.model';
import { Post } from '../shared/models/post.model';


@Injectable({
  providedIn: 'root',
})
export class PostService {
  api: string = 'http://localhost:8084/api/post';
  http: HttpClient = inject(HttpClient);


  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.api, post).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  getAllPublishedPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(this.api);
  }

  getPostsByAuthor(author: string): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.api}/author/${author}`);
  }

  getPostById(id: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.api}/${id}`);
  }


  updatePost(id: number,post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.api}/${id}`, post).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}