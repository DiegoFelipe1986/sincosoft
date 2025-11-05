# API de Fechas Hábiles - Colombia

API REST desarrollada en TypeScript que calcula fechas hábiles en Colombia, considerando días festivos nacionales, horarios laborales y zonas horarias.

## 🎯 Características

- ✅ Cálculo de días hábiles (lunes a viernes, excluyendo festivos)
- ✅ Cálculo de horas hábiles (8:00 AM - 5:00 PM, excluyendo 12:00 PM - 1:00 PM)
- ✅ Integración con API de días festivos de Colombia
- ✅ Manejo correcto de zonas horarias (America/Bogota)
- ✅ Validación completa de parámetros
- ✅ Manejo robusto de errores
- ✅ Tipado estricto con TypeScript

## 📋 Requisitos

- Node.js >= 18.x
- npm >= 9.x

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/DiegoFelipe1986/sincosoft.git
cd sincosoft
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno (opcional):
```bash
cp env.example .env
```

Edita el archivo `.env` si necesitas cambiar la URL de la API de días festivos o el puerto del servidor.

## 🏃 Ejecución

### Desarrollo

Para ejecutar en modo desarrollo con recarga automática:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000` (o el puerto especificado en la variable de entorno `PORT`).

### Producción

1. Compila el proyecto:
```bash
npm run build
```

2. Ejecuta el servidor:
```bash
npm start
```

### Verificación de tipos

Para verificar que no haya errores de TypeScript:
```bash
npm run type-check
```

## 📡 Endpoints

### GET `/health`

Endpoint de salud del servicio.

**Respuesta:**
```json
{
  "status": "ok"
}
```

### GET `/working-days`

Calcula la fecha resultante después de sumar días y/o horas hábiles.

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `days` | integer | No* | Número de días hábiles a sumar (entero positivo) |
| `hours` | integer | No* | Número de horas hábiles a sumar (entero positivo) |
| `date` | string | No | Fecha inicial en formato ISO 8601 UTC (con sufijo Z). Si no se proporciona, se usa la hora actual en Colombia |

*Al menos uno de `days` o `hours` debe estar presente.

#### Respuesta Exitosa (200 OK)

```json
{
  "date": "2025-08-01T14:00:00Z"
}
```

#### Respuesta de Error (400 Bad Request)

```json
{
  "error": "InvalidParameters",
  "message": "Detalle del error"
}
```

#### Respuesta de Error (503 Service Unavailable)

```json
{
  "error": "ServiceUnavailable",
  "message": "Detalle del error"
}
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Sumar 1 día hábil
```bash
curl "http://localhost:3000/working-days?days=1"
```

### Ejemplo 2: Sumar 4 horas hábiles
```bash
curl "http://localhost:3000/working-days?hours=4"
```

### Ejemplo 3: Sumar 1 día y 4 horas hábiles desde una fecha específica
```bash
curl "http://localhost:3000/working-days?days=1&hours=4&date=2025-04-10T15:00:00.000Z"
```

### Ejemplo 4: Sumar días y horas combinados
```bash
curl "http://localhost:3000/working-days?days=5&hours=8"
```

## 🔧 Reglas de Negocio

- **Días hábiles:** Lunes a viernes (excluyendo días festivos)
- **Horario laboral:** 8:00 AM - 5:00 PM (hora de Colombia)
- **Horario de almuerzo:** 12:00 PM - 1:00 PM (excluido del horario laboral)
- **Zona horaria:** America/Bogota (Colombia)
- **Aproximación:** Si la fecha inicial está fuera del horario laboral o no es día hábil, se aproxima hacia atrás al día y hora laboral más cercano
- **Días festivos:** Se obtienen dinámicamente desde la API externa: `https://content.capta.co/Recruitment/WorkingDays.json`

## 🏗️ Estructura del Proyecto

```
src/
├── index.ts                    # Punto de entrada y configuración de Express
├── services/
│   ├── holidayService.ts       # Servicio de días festivos
│   └── workingDaysCalculator.ts # Cálculo de fechas hábiles
├── types/
│   ├── apiTypes.ts            # Tipos de la API
│   └── holidayTypes.ts        # Tipos de días festivos
└── utils/
    ├── dateUtils.ts           # Utilidades de fecha y zona horaria
    ├── errors.ts              # Clases de errores personalizadas
    ├── validators.ts          # Validadores de parámetros
    └── workingDaysUtils.ts    # Lógica de días hábiles
```

## 🛠️ Tecnologías Utilizadas

- **TypeScript** - Lenguaje de programación
- **Express** - Framework web
- **date-fns** - Manipulación de fechas
- **date-fns-tz** - Manejo de zonas horarias

## 📦 Scripts Disponibles

- `npm run build` - Compila el proyecto TypeScript
- `npm start` - Ejecuta el servidor en producción
- `npm run dev` - Ejecuta el servidor en modo desarrollo
- `npm run type-check` - Verifica tipos sin compilar

## 🔒 Validaciones

La API valida:

- Al menos uno de los parámetros `days` o `hours` debe estar presente
- `days` y `hours` deben ser enteros positivos
- `date` debe ser una fecha ISO 8601 válida con sufijo Z (UTC)
- Errores de conexión con la API de días festivos

## 🚢 Despliegue

### Variables de Entorno

El proyecto utiliza variables de entorno para configuración. Puedes crear un archivo `.env` basado en `env.example`:

- `HOLIDAYS_API_URL` - URL de la API de días festivos (por defecto: `https://content.capta.co/Recruitment/WorkingDays.json`)
- `PORT` - Puerto del servidor (por defecto: 3000)

### Ejemplo de despliegue en Vercel

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Despliega:
```bash
vercel
```

### Ejemplo de despliegue en Railway

1. Conecta tu repositorio de GitHub con Railway
2. Railway detectará automáticamente el proyecto Node.js
3. El despliegue se realizará automáticamente

## 📄 Licencia

MIT

## 👤 Autor

Desarrollado como parte de una prueba técnica.

