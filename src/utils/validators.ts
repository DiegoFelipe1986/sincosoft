/**
 * Valida que un string sea un entero positivo
 * @param value - String a validar
 * @returns true si es un entero positivo, false en caso contrario
 */
export function isValidPositiveInteger(value: string): boolean {
  const num: number = parseInt(value, 10);
  return !isNaN(num) && num > 0 && Number.isInteger(num) && value === num.toString();
}

/**
 * Valida que un string sea una fecha ISO 8601 válida con Z (UTC)
 * @param value - String a validar
 * @returns true si es una fecha ISO 8601 válida con Z, false en caso contrario
 */
export function isValidIso8601Date(value: string): boolean {
  // Formato esperado: YYYY-MM-DDTHH:mm:ssZ o YYYY-MM-DDTHH:mm:ss.sssZ
  const iso8601Regex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  
  if (!iso8601Regex.test(value)) {
    return false;
  }
  
  // Intentar parsear la fecha
  const date: Date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Parsea un string a número entero positivo
 * @param value - String a parsear
 * @returns Número entero positivo o null si no es válido
 */
export function parsePositiveInteger(value: string): number | null {
  if (!isValidPositiveInteger(value)) {
    return null;
  }
  return parseInt(value, 10);
}

/**
 * Parsea un string a Date (ISO 8601)
 * @param value - String a parsear
 * @returns Date o null si no es válido
 */
export function parseIso8601Date(value: string): Date | null {
  if (!isValidIso8601Date(value)) {
    return null;
  }
  const date: Date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

