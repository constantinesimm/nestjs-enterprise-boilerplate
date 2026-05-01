import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { ApplicationModule } from '#app/application.module';
import { AppConfigDto, APP_CONFIG_KEY } from '#config/configs/app.config';

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

  if (!appConfig) {
    throw new Error('🚨 Application configuration is missing or invalid!');
  }

  app.setGlobalPrefix(appConfig.globalPrefix);

  app.enableShutdownHooks();

  // Запускаємо додаток
  await app.listen(appConfig.appPort, appConfig.appHost);

  logger.log(
    `🚀 Application is running on: http://${appConfig.appHost}:${appConfig.appPort}/${appConfig.globalPrefix}`,
    'Bootstrap',
  );
}

void bootstrap();
