import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notifications/notification.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss']
})
export class LogoutButtonComponent {
  @Input() showLoginButton: boolean = true;
    
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onOptionSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    if (value === 'logout') {
      this.onLogout();
    } else if (value === 'tasks') {
      this.router.navigate(['/publish']);
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.success('Sesión cerrada exitosamente');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.notificationService.error('Sesion cerrada exitosamente');
        this.authService.purgeAuth();
        this.router.navigate(['/login']);
      }
    });
  }
} 