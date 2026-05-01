import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { Environment } from '#config/shared/enums/environment.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_CONFIG_KEY, AppConfigDto } from '#config/configs/app.config';

/**
 * Global Logger Module.
 * Configures pino-logger for the application based on the current environment.
 */
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { appEnv } = configService.get<AppConfigDto>(APP_CONFIG_KEY)!;
        const isProduction = appEnv === Environment.PRODUCTION;

        const transportConfig = {
          target: 'pino-pretty',
          options: { singleLine: true },
        };

        return {
          pinoHttp: {
            transport: !isProduction ? transportConfig : undefined,
            autoLogging: false,
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
