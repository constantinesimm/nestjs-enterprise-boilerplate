import { join } from 'node:path';
import { registerAs, ConfigFactory } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';
import { globSync } from 'glob';
import { createConfig } from '#config/utils/config.factory';

type ConfigRegistration = ConfigFactory<object> & { KEY: string };

/**
 * Registers a configuration object with a specific token.
 * Uses NestJS's registerAs and the custom createConfig factory.
 *
 * @param token - The unique token for the configuration
 * @param dto - The DTO class to validate the configuration against
 * @returns A registered configuration object
 */
export function registerConfig<T extends object>(
  token: string,
  dto: ClassConstructor<T>,
) {
  return registerAs(token, (): T => createConfig(dto));
}

/**
 * Dynamically discovers and loads all configuration files in the config directory.
 * Scans for *.config.ts or *.config.js files and extracts exported configurations.
 *
 * @returns An array of registered configuration objects
 */
export function discoverConfigs(): ConfigRegistration[] {
  const configDir = join(__dirname, '../configs');

  const configFiles = globSync('**/*.config.{ts,js}', {
    cwd: configDir,
    absolute: true,
    ignore: ['**/utils/**', '**/configuration.module.{ts,js}'],
  });

  const registeredConfigs: ConfigRegistration[] = [];

  for (const filePath of configFiles) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const exported = require(filePath) as Record<string, unknown>;

    const configs = Object.values(exported).filter(
      (val): val is ConfigRegistration =>
        typeof val === 'function' && 'KEY' in val,
    );

    registeredConfigs.push(...configs);
  }

  return registeredConfigs;
}
