/**
 * Handler para AWS Lambda
 * 
 * NOTA: Este archivo requiere las siguientes dependencias:
 * npm install serverless-http @types/aws-lambda
 * 
 * Ejemplo de uso:
 * 1. Instalar dependencias: npm install serverless-http @types/aws-lambda
 * 2. Compilar: npm run build
 * 3. Desplegar con AWS CDK o Serverless Framework
 */

/*
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import serverless from 'serverless-http';
import app from './index';

// Handler para AWS Lambda usando serverless-http
// Convierte eventos de API Gateway a requests de Express
const handler = serverless(app);

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Asegurar que el contexto no expire antes de tiempo
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    // Procesar el evento con serverless-http
    const result = await handler(event, context);
    
    return result as APIGatewayProxyResult;
  } catch (error: unknown) {
    const errorMessage: string = error instanceof Error ? error.message : 'Error desconocido';
    
    console.error('Error en Lambda handler:', errorMessage);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'ServiceUnavailable',
        message: 'Error interno del servidor'
      }),
    };
  }
};
*/

