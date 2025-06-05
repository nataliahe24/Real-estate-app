import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notifications/notification.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss']
})
export class LogoutButtonComponent {
  @Output() logout = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onLogout(): void {
    this.authService.logout();
    this.notificationService.success('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
    this.logout.emit();
  }
} 