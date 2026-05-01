import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Abstract base entity that provides standard properties for all database tables.
 * Utilizes UUIDs for primary keys to ensure global uniqueness.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  public updatedAt!: Date;
}
