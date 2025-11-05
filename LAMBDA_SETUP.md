# Configuración para AWS Lambda

## 📋 Requisitos para Lambda

Para desplegar como Lambda necesitamos:

1. **Adaptar Express para Lambda** - Usar `serverless-http` o `@vendia/serverless-express`
2. **Configurar AWS CDK** - Para infraestructura como código
3. **Ajustar el handler** - Crear un entry point compatible con Lambda

## 🔧 Pasos para Lambda

### Opción 1: Usando serverless-http (Recomendado)

```bash
npm install serverless-http
npm install --save-dev @types/serverless-http
```

### Opción 2: Usando @vendia/serverless-express

```bash
npm install @vendia/serverless-express
```

## 📁 Estructura de archivos necesaria

```
/
├── src/
│   ├── index.ts          # Servidor Express (actual)
│   └── lambda.ts         # Handler para Lambda (nuevo)
├── infra/                # CDK Infrastructure
│   ├── stack.ts
│   └── app.ts
├── cdk.json
└── package.json
```

## 🚀 Beneficios de Lambda

- **Escalabilidad automática**: Se ajusta según la demanda
- **Pago por uso**: Solo pagas por las invocaciones
- **Sin servidor que mantener**: AWS maneja la infraestructura
- **Cold start**: Primera invocación puede ser lenta, pero el cache ayuda
- **Integración con API Gateway**: Fácil de exponer como API REST

## ⚠️ Consideraciones

1. **Timeout**: Lambda tiene límite de 15 minutos (más que suficiente para nuestro caso)
2. **Memoria**: Puedes configurar hasta 10GB
3. **Cold starts**: El cache de días festivos ayuda a minimizar el impacto
4. **Variables de entorno**: Se configuran en Lambda, no en `.env`
5. **Node.js runtime**: Lambda soporta Node.js 18.x y 20.x

## 💰 Costo estimado

- **Primeras 1M requests/mes**: Gratis
- **Después**: ~$0.20 por 1M requests
- **Costo de memoria**: Mínimo

## 🔗 Integración con API Gateway

Lambda se puede exponer directamente o mediante API Gateway:
- API Gateway REST API
- API Gateway HTTP API (más económico)
- Function URLs (más simple)

