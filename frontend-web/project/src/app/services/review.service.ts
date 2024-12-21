import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ReviewResponse } from '../shared/models/reviewResponse.model';
import { Review } from '../shared/models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  api: string = 'http://localhost:8083/api/reviews';
  http: HttpClient = inject(HttpClient);


  getAllReviews(): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.api}`);
  }

  reviewPost(reviewId: number, review: Review): Observable<Comment> {
    return this.http.post<Comment>(`${this.api}/${reviewId}`, review).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  
}