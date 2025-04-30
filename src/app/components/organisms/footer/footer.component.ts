import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  quickLinks = [
    { label: 'Buscar Propiedades', route: '/properties' },
    { label: 'Publica tu propiedad', route: '/publish' },
    { label: 'Property Management', route: '/management' }
  ];
  
  contactInfo = {
    phone: '+800125623525',
    email: 'info@hogar360.com',
    address: 'cll 17 #170 Springfield '
  };
  
  socialLinks = [
    { icon: 'facebook', url: '#' },
    { icon: 'twitter', url: '#' },
    { icon: 'instagram', url: '#' },
    { icon: 'linkedin', url: '#' }
  ];
} 