import { HolidayApiResponse, HolidayCache } from '../types/holidayTypes';
import { format } from 'date-fns';
import { HolidaysFetchError } from '../utils/errors';

/**
 * URL de la API de días festivos de Colombia
 */
const HOLIDAYS_API_URL: string = 'https://content.capta.co/Recruitment/WorkingDays.json';

/**
 * Cache para almacenar los días festivos
 */
let holidaysCache: HolidayCache | null = null;

/**
 * Obtiene los días festivos desde la API externa
 * @returns Promise con un Set de fechas festivas en formato YYYY-MM-DD
 * @throws Error si falla la petición a la API
 */
export async function fetchHolidays(): Promise<HolidayCache> {
  try {
    const response: Response = await fetch(HOLIDAYS_API_URL, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new HolidaysFetchError(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: unknown = await response.json();
    
    // Validar que la respuesta tenga la estructura esperada
    if (!data || typeof data !== 'object' || !('workingDays' in data)) {
      throw new HolidaysFetchError('La respuesta de la API no tiene el formato esperado');
    }
    
    const holidayData: HolidayApiResponse = data as HolidayApiResponse;
    
    // Validar que workingDays sea un array
    if (!Array.isArray(holidayData.workingDays)) {
      throw new HolidaysFetchError('El campo "workingDays" debe ser un array');
    }
    
    // Convertir el array de strings a un Set para búsqueda eficiente
    const holidaysSet: HolidayCache = new Set<string>(holidayData.workingDays);
    
    return holidaysSet;
  } catch (error: unknown) {
    // Si ya es un HolidaysFetchError, relanzarlo
    if (error instanceof HolidaysFetchError) {
      throw error;
    }
    
    // Si es un Error de red u otro tipo, convertirlo
    const errorMessage: string = error instanceof Error ? error.message : 'Error desconocido al obtener días festivos';
    
    // Detectar errores de red
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('ECONNREFUSED')) {
      throw new HolidaysFetchError('No se pudo conectar con el servicio de días festivos');
    }
    
    throw new HolidaysFetchError(errorMessage);
  }
}

/**
 * Obtiene los días festivos, usando cache si está disponible
 * @returns Promise con un Set de fechas festivas
 */
export async function getHolidays(): Promise<HolidayCache> {
  if (holidaysCache === null) {
    holidaysCache = await fetchHolidays();
  }
  
  return holidaysCache;
}

/**
 * Verifica si una fecha es día festivo en Colombia
 * @param date - Fecha a verificar (en zona horaria de Colombia)
 * @returns Promise<boolean> true si es festivo, false en caso contrario
 */
export async function isHoliday(date: Date): Promise<boolean> {
  // Formatear la fecha como YYYY-MM-DD para comparar con los festivos
  const dateString: string = format(date, 'yyyy-MM-dd');
  
  const holidays: HolidayCache = await getHolidays();
  
  return holidays.has(dateString);
}

/**
 * Limpia el cache de días festivos (útil para testing o refrescar datos)
 */
export function clearHolidaysCache(): void {
  holidaysCache = null;
}

