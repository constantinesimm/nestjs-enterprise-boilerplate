import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import {
  DatabaseConfigDto,
  DATABASE_CONFIG_KEY,
} from '#config/configs/database.config';
import { AppConfigDto, APP_CONFIG_KEY } from '#config/configs/app.config';

import { Environment } from '#config/shared/enums/environment.enum';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

/**
 * Database Infrastructure Module.
 * Configures TypeORM for PostgreSQL using the validated environment configurations.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig =
          configService.get<DatabaseConfigDto>(DATABASE_CONFIG_KEY);
        const appConfig = configService.get<AppConfigDto>(APP_CONFIG_KEY);

        if (!dbConfig || !appConfig) {
          throw new Error('🚨 Database or App configuration is missing!');
        }

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name,

          // Automatically maps camelCase properties to snake_case DB columns
          namingStrategy: new SnakeNamingStrategy(),

          // Automatically load entities from all modules
          autoLoadEntities: true,

          // STRICT RULE: Never use synchronize in any environment
          synchronize: false,

          // AUTOMATIC MIGRATIONS: Run pending migrations on application bootstrap
          migrationsRun: true,

          // Path to migration files (resolves correctly in both src/ and dist/ directories)
          migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],

          // Enable DB logs only in development
          logging: appConfig.appEnv === Environment.DEVELOPMENT,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
