/**
 * Ejemplo de stack AWS CDK para Lambda
 * 
 * Para usar este ejemplo:
 * 1. npm install aws-cdk-lib @aws-cdk/aws-lambda @aws-cdk/aws-apigateway constructs
 * 2. npm install --save-dev aws-cdk
 * 3. cdk init --language typescript
 * 4. Reemplazar el stack generado con este código
 */

/*
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class WorkingDaysLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda Function
    const workingDaysLambda = new lambda.Function(this, 'WorkingDaysLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.lambdaHandler',
      code: lambda.Code.fromAsset('dist'),
      environment: {
        HOLIDAYS_API_URL: process.env.HOLIDAYS_API_URL || 'https://content.capta.co/Recruitment/WorkingDays.json',
        NODE_ENV: 'production',
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
    });

    // API Gateway REST API
    const api = new apigateway.RestApi(this, 'WorkingDaysApi', {
      restApiName: 'Working Days API',
      description: 'API para cálculo de fechas hábiles en Colombia',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // Integración Lambda con API Gateway
    const lambdaIntegration = new apigateway.LambdaIntegration(workingDaysLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    // Rutas
    api.root.addResource('health').addMethod('GET', lambdaIntegration);
    api.root.addResource('working-days').addMethod('GET', lambdaIntegration);

    // Output de la URL de la API
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'URL de la API Gateway',
    });
  }
}
*/

