import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { Notification } from '../shared/models/notification.model';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch notifications for a specific author', () => {
    const author = 'user1';
    const mockNotifications: Notification[] = [
      { id: 1,  message: 'Notification 1', timestamp: new Date().toISOString() },
      { id: 2, message: 'Notification 2', timestamp: new Date().toISOString() },
    ];

    service.getNotifications(author).subscribe(notifications => {
      expect(notifications).toEqual(mockNotifications);
    });

    const req = httpMock.expectOne(`${service.api}/${author}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNotifications);
  });

  it('should handle error when fetching notifications', () => {
    const author = 'user1';

    service.getNotifications(author).subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${service.api}/${author}`);
    req.error(new ErrorEvent('Network error'));
  });
});
