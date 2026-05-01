import { config } from 'dotenv';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config({ path: resolve(process.cwd(), 'keys/.env') });

/**
 * TypeORM DataSource instance.
 * Required for CLI operations like generating or running migrations.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Automatically maps camelCase properties to snake_case DB columns
  namingStrategy: new SnakeNamingStrategy(),
  entities: [resolve(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [resolve(__dirname, './migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
