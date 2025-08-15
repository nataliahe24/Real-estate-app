export class ValidationPropertyFilter {
    static isValidValue(value: any): boolean {
      return value !== null && value !== undefined && value !== '';
    }
  }
  