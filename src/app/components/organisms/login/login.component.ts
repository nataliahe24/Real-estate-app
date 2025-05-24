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
    { label: 'Compra', route: '/properties' },
    { label: 'Renta', route: '/properties' },
    { label: 'Vende', route: '/publish' }
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
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.notificationService.error('Error al iniciar sesión: ' + 
            (error.error?.message || 'Error desconocido'));
        }
      });
    }
  }
}