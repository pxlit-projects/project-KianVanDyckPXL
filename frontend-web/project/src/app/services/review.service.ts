import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ReviewResponse } from '../shared/models/reviewResponse.model';
import { Review } from '../shared/models/review.model';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  api: string = environment.reviewApiUrl;
  http: HttpClient = inject(HttpClient);
  
  authService: AuthService = inject(AuthService);

  private getHeaders(): HttpHeaders {
    const user = this.authService.getUser();
    const roleHeader = user ? user.role : 'GUEST';
    return new HttpHeaders({
      'Role': roleHeader
    });
  }



  getAllReviews(): Observable<ReviewResponse[]> {
    const headers = this.getHeaders();
    return this.http.get<ReviewResponse[]>(`${this.api}`, { headers });
  }

  reviewPost(reviewId: number, review: Review): Observable<Review> {
    const headers = this.getHeaders();
    return this.http.post<Review>(`${this.api}/${reviewId}`, review, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}