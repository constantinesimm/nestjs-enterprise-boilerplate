// src/config/app.config.ts
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString, MinLength } from 'class-validator';
import { registerConfig } from '#config/utils/config.loader';

import { Environment } from '#config/shared/enums/environment.enum';

export const APP_CONFIG_KEY = 'app';

/**
 * Data Transfer Object for Application Configuration.
 * Validates core application environment variables.
 */
export class AppConfigDto {
  @Expose({ name: 'NODE_ENV' })
  @IsEnum(Environment)
  public readonly appEnv!: Environment;

  @Expose({ name: 'APP_HOST' })
  @IsString()
  public readonly appHost!: string;

  @Expose({ name: 'APP_PORT' })
  @IsNumber()
  public readonly appPort!: number;

  @Expose({ name: 'APP_NAME' })
  @IsString()
  @MinLength(1)
  public readonly appName!: string;

  @Expose({ name: 'APP_GLOBAL_PREFIX' })
  @IsString()
  public readonly globalPrefix!: string;
}

export const appConfig = registerConfig(APP_CONFIG_KEY, AppConfigDto);
