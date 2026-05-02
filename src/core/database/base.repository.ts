import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { BaseEntity } from '#core/database/base.entity';

/**
 * Abstract Base Repository to encapsulate TypeORM-specific logic.
 * Enforces strict boundaries between the Application layer (CQRS Handlers) and Infrastructure.
 *
 * @template T - The entity type extending BaseEntity
 */
export abstract class BaseRepository<T extends BaseEntity> {
  protected constructor(protected readonly repository: Repository<T>) {}

  /**
   * Saves a given entity to the database.
   * If the entity does not exist, it inserts it; otherwise, it updates it.
   */
  public async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  /**
   * Saves multiple entities at once in a single transaction.
   */
  public async saveMany(entities: DeepPartial<T>[]): Promise<T[]> {
    return this.repository.save(entities);
  }

  /**
   * Finds an entity by its globally unique identifier (UUID) with optional relations.
   */
  public async findOneById(
    id: string,
    relations?: FindOptionsRelations<T>,
  ): Promise<T | null> {
    return this.repository.findOne({
      // Type assertion is required due to TypeORM's strictness with dynamic keys in generics
      where: { id } as unknown as FindOptionsWhere<T>,
      relations,
    });
  }

  /**
   * Finds a single entity based on specified options (including relations).
   */
  public async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  /**
   * Finds all entities matching the specified options (including relations).
   */
  public async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  /**
   * Removes a given entity from the database.
   */
  public async remove(entity: T): Promise<T> {
    return this.repository.remove(entity);
  }
}
