import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notifications/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  menuItems = [
    { label: 'Inicio', route: '' },
    { label: 'Nosotros', route: '' },
    { label: 'Contacto', route: '' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          if (response && response.accessToken) {
            this.notificationService.success('Inicio de sesión exitoso');
            
            if (this.authService.isAdmin()) {
              this.router.navigate(['/wellcome-admin']);
            } else if (this.authService.isSeller()) {
              this.router.navigate(['/wellcome-seller']);
            } else if (this.authService.isBuyer()) {
              this.router.navigate(['/wellcome-buyer']);
            } else {
              this.router.navigate(['/login']);
            }
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          if (error.status === 403) {
            this.notificationService.error('Usuario o contraseña incorrectos');
          } else {
            this.notificationService.error('Error al iniciar sesión: ' + 
              (error.error?.message || 'Error desconocido'));
          }
        }
      });
    }
  }
}