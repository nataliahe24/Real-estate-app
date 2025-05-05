import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timeout?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 0;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor() {}

  addNotification(type: 'success' | 'error' | 'warning' | 'info', message: string, timeout = 5000): number {
    const id = this.nextId++;
    const notification: Notification = { id, type, message, timeout };
    
    const currentNotifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...currentNotifications, notification]);
    
    if (timeout > 0) {
      setTimeout(() => this.removeNotification(id), timeout);
    }
    
    return id;
  }

  removeNotification(id: number): void {
    const currentNotifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  error(message: string, timeout = 5000): number {
    return this.addNotification('error', message, timeout);
  }

  success(message: string, timeout = 5000): number {
    return this.addNotification('success', message, timeout);
  }

  warning(message: string, timeout = 5000): number {
    return this.addNotification('warning', message, timeout);
  }

  info(message: string, timeout = 5000): number {
    return this.addNotification('info', message, timeout);
  }
} 