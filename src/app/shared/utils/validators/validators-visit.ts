import { AbstractControl, ValidationErrors } from '@angular/forms';

export const dateInPastValidator = (): (control: AbstractControl) => ValidationErrors | null => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? { dateInPast: true } : null;
  };
};

export const maxDateValidator = (maxDays: number): (control: AbstractControl) => ValidationErrors | null => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDays);
    return selectedDate > maxDate ? { maxDate: true } : null;
  };
};

export const endDateValidator = (startDate: string): (control: AbstractControl) => ValidationErrors | null => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !startDate) return null;
    const endDate = new Date(control.value);
    const start = new Date(startDate);
    return endDate <= start ? { endDateBeforeStart: true } : null;
  };
}; 

export function sameDayValidator(startDate: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    const endDate = control.value;
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const isSameDay = start.getFullYear() === end.getFullYear() &&
                      start.getMonth() === end.getMonth() &&
                      start.getDate() === end.getDate();

    return isSameDay ? null : { notSameDay: true };
  };
}