import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { validateSync, ValidationError } from 'class-validator';

/**
 * Factory function to create and validate a configuration object from environment variables.
 * Uses class-transformer to instantiate the DTO and class-validator to validate it.
 * Throws an error and logs if the configuration is invalid.
 *
 * @param dto - The DTO class constructor representing the expected configuration structure
 * @returns The validated configuration instance
 */
export function createConfig<T extends object>(dto: ClassConstructor<T>): T {
  const logger = new Logger('ConfigFactory');

  const validatedConfig = plainToInstance(dto, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const message = formatErrors(errors);
    logger.error(`🚨 Configuration [${dto.name}] is invalid:\n${message}`);
    throw new Error(`Config validation error for ${dto.name}`);
  }

  return validatedConfig;
}

function formatErrors(errors: ValidationError[]): string {
  return errors
    .map((err) => {
      const constraints = Object.values(err.constraints || {}).join(', ');
      return `  - Property [${err.property}]: ${constraints}`;
    })
    .join('\n');
}
