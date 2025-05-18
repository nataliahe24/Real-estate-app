import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-user-layout',
  templateUrl: './seller-user-layout.component.html',
  styleUrls: ['./seller-user-layout.component.scss']
})
export class SellerUserLayoutComponent {
  user = {
    name: 'Vendedor',
    avatar: '/assets/images/usuario.jpeg'
  };
  menuItems = [
    { icon: 'home', label: 'Publicaciones', route: '/publications'},
    { icon: 'meeting_room', label: 'Citas', route: '/appointments'}
  ];
}