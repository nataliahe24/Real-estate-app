import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static priceRange(min: number, max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (value === null || value === undefined) {
        return null;
      }
      
      if (value < min || value > max) {
        return {
          priceRange: {
            min,
            max,
            actual: value
          }
        };
      }
      
      return null;
    };
  }
} 