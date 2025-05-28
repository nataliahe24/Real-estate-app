import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {

  constructor(private readonly authService: AuthService) {}
  
  user = {
    name: this.authService.getCurrentUser()?.name ?? '',
    avatar: '/assets/images/usuario.jpeg'
  };
  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard'},
    { icon: 'category', label: 'Categorías', route: '/categories'},
    { icon: 'location_on', label: 'Ubicaciones', route: '/locations'},
    { icon: 'person', label: 'Usuarios', route: '/users'}
  ];
} 