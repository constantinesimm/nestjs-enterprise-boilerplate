import { join } from 'node:path';
import { registerAs, ConfigFactory } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';
import { globSync } from 'glob';
import { createConfig } from '#config/utils/config.factory';

type ConfigRegistration = ConfigFactory<object> & { KEY: string };

export function registerConfig<T extends object>(
  token: string,
  dto: ClassConstructor<T>,
) {
  return registerAs(token, (): T => createConfig(dto));
}

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
