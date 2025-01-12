import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Notification } from '../shared/models/notification.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  api: string = environment.notificationsApiUrl;
  http: HttpClient = inject(HttpClient);

  getNotifications(author: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.api}/${author}`);
  }
}
