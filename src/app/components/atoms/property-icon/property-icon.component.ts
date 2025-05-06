import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-property-icon',
  templateUrl: './property-icon.component.html',
  styleUrls: ['./property-icon.component.scss']
})
export class PropertyIconComponent {
  @Input() icon: string = '';
  @Input() value: string | number = '';
} 