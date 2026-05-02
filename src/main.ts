import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ApplicationModule } from '#app/application.module';
import { AppConfigDto, APP_CONFIG_KEY } from '#config/configs/app.config';
import {
  SwaggerConfigDto,
  SWAGGER_CONFIG_KEY,
} from '#config/configs/swagger.config';

/**
 * Bootstrap the NestJS application.
 * Configures Fastify, logging, and global settings.
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfigDto>(APP_CONFIG_KEY);
  const swaggerConfig = configService.get<SwaggerConfigDto>(SWAGGER_CONFIG_KEY);

  if (!appConfig || !swaggerConfig) {
    throw new Error('🚨 Application or Swagger configuration is missing!');
  }

  app.setGlobalPrefix(appConfig.globalPrefix);

  // --- Swagger Setup ---
  if (swaggerConfig.enabled) {
    // Safely parse package.json to get the real application version
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
      version: string;
    };

    const documentBuilder = new DocumentBuilder()
      .setTitle('Enterprise Boilerplate API')
      .setDescription('API documentation for the Modular Monolith')
      .setVersion(packageJson.version || '1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, documentBuilder);
    SwaggerModule.setup(swaggerConfig.path, app, document);

    logger.log(
      `📄 Swagger UI is available at: http://${appConfig.appHost}:${appConfig.appPort}/${swaggerConfig.path}`,
      'Bootstrap',
    );
  }

  app.enableShutdownHooks();

  await app.listen(appConfig.appPort, appConfig.appHost);

  logger.log(
    `🚀 Application is running on: http://${appConfig.appHost}:${appConfig.appPort}/${appConfig.globalPrefix}`,
    'Bootstrap',
  );
}

void bootstrap();
