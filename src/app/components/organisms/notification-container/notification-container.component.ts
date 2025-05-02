import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../../core/services/notifications/notification.service';

@Component({
  selector: 'app-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss']
})
export class NotificationContainerComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  closeNotification(id: number): void {
    this.notificationService.removeNotification(id);
  }
} 