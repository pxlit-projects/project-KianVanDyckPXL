import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Notification } from '../../shared/models/notification.model';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  notifications: Notification[] = [];
  showNotifications: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }



  ngOnInit() {
    const author = this.authService.getUser()?.name;
    if (author) {
      this.notificationService.getNotifications(author).subscribe(
        (data) => {
          this.notifications = data;
        },
        (error) => {
          console.error('Error fetching notifications:', error);
        }
      );
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

}