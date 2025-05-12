import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard'},
    { icon: 'category', label: 'Categorías', route: '/categories'},
    { icon: 'home', label: 'Propiedades', route: '/properties'},
    { icon: 'location_on', label: 'Ubicaciones', route: '/locations'},
    { icon: 'person', label: 'Usuarios', route: '/users'},
    { icon: 'settings', label: 'Configuración', route: '/settings'}
  ];
} 