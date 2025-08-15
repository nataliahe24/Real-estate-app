import { Component, Input } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-seller-user-layout',
  templateUrl: './seller-user-layout.component.html',
  styleUrls: ['./seller-user-layout.component.scss']
})
export class SellerUserLayoutComponent {
  @Input() showSidebar: boolean = true;
  
  constructor(private readonly authService: AuthService) {}
  
  currentUser = this.authService.getCurrentUser();

  user = {
    name: this.currentUser?.name ?? '',
    avatar: '/assets/images/usuario.jpeg'
  };
  menuItems = [
    { icon: 'home', label: 'Publicaciones', route: '/publish'},
    { icon: 'meeting_room', label: 'Visitas', route: '/visit'},
    { icon: 'calendar_month', label: 'Visitas Programadas', route: '/schedule-visit-list'}
  ];
}