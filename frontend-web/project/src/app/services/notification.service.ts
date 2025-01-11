import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Notification } from '../shared/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  api: string = 'http://localhost:8093/review/api/notifications';
  http: HttpClient = inject(HttpClient);

  getNotifications(author: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.api}/${author}`);
  }
}
