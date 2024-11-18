import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { PostResponse } from '../shared/models/postResponse.model';

interface Post {
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  api: string = 'http://localhost:8082/api/post';
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
}