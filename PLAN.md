# Plan de Implementación - API de Fechas Hábiles Colombia

## 📋 Estado Actual
- ✅ Configuración inicial (TypeScript, Express, dependencias)
- ✅ Utilidades básicas de fecha (conversión UTC/Colombia, formato)

## 🎯 Plan de Implementación por Pasos

### Paso 3: Servicio de Días Festivos
**Objetivo:** Obtener y manejar días festivos de Colombia desde la API externa

**Archivos a crear:**
- `src/services/holidayService.ts`
  - Función para obtener días festivos desde: https://content.capta.co/Recruitment/WorkingDays.json
  - Cachear los días festivos (evitar múltiples requests)
  - Función para verificar si una fecha es festivo
  - Tipos TypeScript para la respuesta de la API

**Lógica:**
- Fetch de la API externa
- Parsear fechas y almacenarlas en formato comparable
- Función `isHoliday(date: Date): boolean`

---

### Paso 4: Lógica de Días Hábiles y Horarios Laborales
**Objetivo:** Implementar reglas de negocio (días hábiles, horarios, aproximación)

**Archivos a crear:**
- `src/utils/workingDaysUtils.ts`
  - Función para verificar si es día hábil (lunes-viernes, excluyendo festivos)
  - Función para verificar si está en horario laboral (8am-5pm, excluyendo 12pm-1pm)
  - Función para aproximar hacia atrás a fecha/hora laboral más cercana
  - Constantes para horarios (8:00, 12:00, 13:00, 17:00)

**Lógica:**
- `isWorkingDay(date: Date): boolean` - verifica lunes-viernes y no festivo
- `isWorkingHours(date: Date): boolean` - verifica horario 8am-5pm excluyendo 12pm-1pm
- `normalizeToWorkingTime(date: Date): Date` - aproxima hacia atrás al tiempo laboral más cercano

---

### Paso 5: Cálculo de Fechas Hábiles
**Objetivo:** Implementar la lógica principal de suma de días y horas hábiles

**Archivos a crear:**
- `src/services/workingDaysCalculator.ts`
  - Función principal `calculateWorkingDays(date: Date, days: number, hours: number): Date`
  - Lógica para sumar días hábiles (saltar fines de semana y festivos)
  - Lógica para sumar horas hábiles (respetar horario laboral, saltar almuerzo)
  - Manejar casos especiales (saltar fines de semana, festivos, pasar al siguiente día)

**Lógica:**
1. Normalizar fecha inicial (aproximar hacia atrás si es necesario)
2. Sumar días hábiles primero (si se proporciona)
3. Luego sumar horas hábiles (si se proporciona)
4. Respetar horarios laborales y saltar no laborables

---

### Paso 6: API REST con Validación
**Objetivo:** Crear el endpoint GET con validación de parámetros

**Archivos a modificar:**
- `src/index.ts`
  - Endpoint GET `/working-days` (o ruta elegida)
  - Validación de query parameters (days, hours, date)
  - Parseo de parámetros
  - Llamada al servicio de cálculo

**Archivos a crear:**
- `src/types/apiTypes.ts`
  - Tipos para request/response
  - Interface para query parameters
  - Interface para respuesta exitosa y errores

**Validaciones:**
- Al menos uno de `days` o `hours` debe estar presente
- `days` y `hours` deben ser enteros positivos
- `date` debe ser ISO 8601 válido con Z
- Respuesta en formato exacto: `{ "date": "2025-08-01T14:00:00Z" }`

---

### Paso 7: Manejo de Errores
**Objetivo:** Implementar manejo robusto de errores

**Archivos a modificar:**
- `src/index.ts`
  - Middleware de manejo de errores
  - Validación de errores de API externa (días festivos)
  - Errores 400 para parámetros inválidos
  - Errores 503 para fallos de servicios externos

**Tipos de errores:**
- `InvalidParameters` - parámetros faltantes o inválidos
- `ServiceUnavailable` - fallo al obtener días festivos
- Formato: `{ "error": "TipoError", "message": "Detalle" }`

---

### Paso 8: README y Documentación
**Objetivo:** Documentar el proyecto

**Archivos a crear:**
- `README.md`
  - Descripción del proyecto
  - Instrucciones de instalación
  - Instrucciones de ejecución
  - Ejemplos de uso
  - Estructura del proyecto

---

## 🔄 Orden de Implementación (Commits)

1. ✅ **Commit 1:** Configuración inicial del proyecto
2. ✅ **Commit 2:** Utilidades de zona horaria y fecha
3. **Commit 3:** Servicio de días festivos (fetch y cache)
4. **Commit 4:** Lógica de días hábiles y horarios laborales
5. **Commit 5:** Cálculo principal de fechas hábiles
6. **Commit 6:** API REST con validación de parámetros
7. **Commit 7:** Manejo de errores completo
8. **Commit 8:** README con documentación

---

## 📝 Notas Importantes

- Todo en TypeScript con tipado explícito
- Todas las funciones deben tener tipos explícitos
- Los cálculos deben hacerse en hora de Colombia
- La respuesta final debe ser en UTC
- Si la fecha está fuera de horario laboral, aproximar hacia atrás
- Días festivos deben obtenerse de la API externa
- Cachear días festivos para eficiencia

