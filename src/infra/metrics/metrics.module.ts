import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import {
  METRICS_CONFIG_KEY,
  MetricsConfigDto,
} from '#config/configs/metrics.config';

@Module({
  imports: [
    PrometheusModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const metricsConfig =
          configService.get<MetricsConfigDto>(METRICS_CONFIG_KEY);

        if (!metricsConfig) {
          throw new Error('🚨 Metrics configuration is missing!');
        }

        return {
          // Expose the metrics endpoint based on the configuration
          path: metricsConfig.path,

          // Automatically collect default Node.js metrics (CPU, Memory, Event Loop)
          defaultMetrics: {
            enabled: metricsConfig.enabled,
          },
        };
      },
    }),
  ],
})
export class MetricsModule {}
