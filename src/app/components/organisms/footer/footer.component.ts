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
    { iconClass: 'assets/images/facebook.png', url: 'https://facebook.com' },
    { iconClass: 'assets/images/x.png', url: 'https://twitter.com' },
    { iconClass: 'assets/images/instagram.png', url: 'https://instagram.com' },
    { iconClass: 'assets/images/linkedin.png', url: 'https://linkedin.com' }
  ];
} 
