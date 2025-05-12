import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() type: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() isSubmit: boolean = false;
  @Output() click = new EventEmitter<void>();

  handleClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }
} 