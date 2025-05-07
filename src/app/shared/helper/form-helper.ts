import { AbstractControl } from '@angular/forms';

/**
 * Calcula los caracteres restantes para un control de formulario
 * @param control El control de formulario a evaluar
 * @param maxLength Longitud máxima permitida
 * @returns Número de caracteres restantes
 */
export function getRemainingChars(control: AbstractControl | null, maxLength: number): number {
  if (!control) return maxLength;
  
  const currentLength = control.value?.length || 0;
  return Math.max(0, maxLength - currentLength);
}

/**
 * Crea un objeto con información para mostrar al usuario sobre el estado del campo
 * @param control El control de formulario a evaluar
 * @param maxLength Longitud máxima permitida
 * @param minLength Longitud mínima requerida (opcional)
 * @returns Objeto con información sobre los caracteres
 */
export function getCharacterInfo(
  control: AbstractControl | null, 
  maxLength: number, 
  minLength: number = 0
): { remaining: number; isValid: boolean; message: string } {
  if (!control) {
    return { 
      remaining: maxLength, 
      isValid: false, 
      message: `${maxLength} caracteres restantes` 
    };
  }
  
  const currentLength = control.value?.length || 0;
  const remaining = maxLength - currentLength;
  const isValid = currentLength >= minLength && currentLength <= maxLength;
  
  let message = `${remaining} caracteres restantes`;
  if (currentLength < minLength) {
    const needed = minLength - currentLength;
    message = `Necesitas ${needed} caracteres más`;
  }
  
  return { remaining, isValid, message };
}