import { Expose } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { registerConfig } from '#config/utils/config.loader';

export const DATABASE_CONFIG_KEY = 'database';

/**
 * Data Transfer Object for Database Configuration.
 * Validates environment variables required for the database connection.
 */
export class DatabaseConfigDto {
  @Expose({ name: 'DB_HOST' })
  @IsString()
  public readonly host!: string;

  @Expose({ name: 'DB_PORT' })
  @IsNumber()
  public readonly port!: number;

  @Expose({ name: 'DB_USER' })
  @IsString()
  public readonly user!: string;

  @Expose({ name: 'DB_PASSWORD' })
  @IsString()
  public readonly password!: string;

  @Expose({ name: 'DB_NAME' })
  @IsString()
  @MinLength(1)
  public readonly name!: string;
}

export const databaseConfig = registerConfig(
  DATABASE_CONFIG_KEY,
  DatabaseConfigDto,
);
