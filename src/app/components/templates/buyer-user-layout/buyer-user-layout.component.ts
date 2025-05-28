import { Component, Input } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-buyer-user-layout',
  templateUrl: './buyer-user-layout.component.html',
  styleUrls: ['./buyer-user-layout.component.scss']
})
export class BuyerUserLayoutComponent {
  @Input() showSidebar: boolean = true;
  
  constructor(private readonly authService: AuthService) {}
  
  currentUser = this.authService.getCurrentUser();

  user = {
    name: this.currentUser?.name ?? '',
    avatar: '/assets/images/usuario.jpeg'
  };
  menuItems = [
    { icon: 'home', label: 'Agendar Visita', route: '/visit-schedules'}
  ];
}