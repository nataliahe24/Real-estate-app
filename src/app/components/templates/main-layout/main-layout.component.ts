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
} 