import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() maxLength: number | null = null;
  @Input() required: boolean = false;
  @Input() ngClass: any;
  @Input() errorMessage: string = '';
  @Input() class = '';
  @Input() autocomplete = 'off';
  @Input() ngModel: any;
  @Output() ngModelChange = new EventEmitter<any>();
  @Output() input = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<Event>();

  onChange: any = () => {};
  onTouched: any = () => {};
  
  writeValue(value: any): void {
    this.value = value;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  updateValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
} 