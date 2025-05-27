import { Component } from '@angular/core';

@Component({
  selector: 'app-properties-layout',
  templateUrl: './properties-layout.component.html',
  styleUrls: ['./properties-layout.component.scss']
})
export class PropertiesLayoutComponent {
  menuItems = [
    { label: 'Compra', route: '' },
    { label: 'Renta', route: '' },
    { label: 'Vende', route: '' }
  ];
} 