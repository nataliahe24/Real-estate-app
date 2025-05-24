import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  user = {
    name: 'Admin',
    avatar: '/assets/images/usuario.jpeg'
  };
  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard'},
    { icon: 'category', label: 'Categorías', route: '/categories'},
    { icon: 'home', label: 'Propiedades'},
    { icon: 'location_on', label: 'Ubicaciones', route: '/locations'},
    { icon: 'person', label: 'Usuarios', route: '/users'},
    { icon: 'settings', label: 'Configuración', route: '/settings'}
  ];
} 