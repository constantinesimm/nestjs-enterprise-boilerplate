import { Module } from '@nestjs/common';
import { ConfigurationModule } from '#config/configuration.module';
import { LoggerModule } from '#core/logger/logger.module';
import { DatabaseModule } from '#infra/database/database.module';

/**
 * The root Application Module.
 * Centralizes imports for core infrastructure such as Configuration, Logger, and Database.
 */
@Module({
  imports: [ConfigurationModule.forRoot(), LoggerModule, DatabaseModule],
})
export class ApplicationModule {}
