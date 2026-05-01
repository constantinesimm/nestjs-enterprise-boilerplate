import { resolve } from 'node:path';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { discoverConfigs } from '#config/utils/config.loader';

/**
 * Dynamic Configuration Module.
 * Responsible for discovering, loading, and validating environment variables.
 */
@Module({})
export class ConfigurationModule {
  static async forRoot(): Promise<DynamicModule> {
    const configs = await discoverConfigs();

    return {
      module: ConfigurationModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: resolve(process.cwd(), 'keys/.env'),
          load: configs,
          cache: true,
        }),
      ],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
