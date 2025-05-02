import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../../core/services/notifications/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Input() notification!: Notification;
  @Output() close = new EventEmitter<number>();

  onClose(): void {
    this.close.emit(this.notification.id);
  }
} 