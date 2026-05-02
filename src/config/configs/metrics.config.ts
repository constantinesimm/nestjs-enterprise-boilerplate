import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

import { registerConfig } from '#config/utils/config.loader';

export const METRICS_CONFIG_KEY = 'metrics';

export class MetricsConfigDto {
  @Expose({ name: 'METRICS_ENABLED' })
  @Type(() => Boolean)
  @IsBoolean()
  public readonly enabled!: boolean;

  @Expose({ name: 'METRICS_PATH' })
  @IsString()
  public readonly path!: string;
}

export const metricsConfig = registerConfig(
  METRICS_CONFIG_KEY,
  MetricsConfigDto,
);
