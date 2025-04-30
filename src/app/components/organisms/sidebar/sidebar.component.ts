import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', active: false },
    { icon: 'category', label: 'Categorías', route: '/categories', active: true },
    { icon: 'home', label: 'Propiedades', route: '/properties', active: false },
    { icon: 'person', label: 'Usuarios', route: '/users', active: false },
    { icon: 'settings', label: 'Configuración', route: '/settings', active: false }
  ];
} 