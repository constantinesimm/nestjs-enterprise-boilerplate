import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
import { registerConfig } from '#config/utils/config.loader';

export const SWAGGER_CONFIG_KEY = 'swagger';

export class SwaggerConfigDto {
  @Expose({ name: 'SWAGGER_ENABLED' })
  @Type(() => Boolean)
  @IsBoolean()
  public readonly enabled!: boolean;

  @Expose({ name: 'SWAGGER_PATH' })
  @IsString()
  public readonly path!: string;
}

export const swaggerConfig = registerConfig(
  SWAGGER_CONFIG_KEY,
  SwaggerConfigDto,
);
