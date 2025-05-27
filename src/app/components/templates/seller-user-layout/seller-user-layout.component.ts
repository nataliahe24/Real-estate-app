import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-seller-user-layout',
  templateUrl: './seller-user-layout.component.html',
  styleUrls: ['./seller-user-layout.component.scss']
})
export class SellerUserLayoutComponent {
  @Input() showSidebar: boolean = true;

  user = {
    name: 'Vendedor',
    avatar: '/assets/images/usuario.jpeg'
  };
  menuItems = [
    { icon: 'home', label: 'Publicaciones', route: '/publish'},
    { icon: 'meeting_room', label: 'Citas', route: '/appointments'}
  ];
}