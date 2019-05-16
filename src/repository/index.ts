import { Model, Types } from 'mongoose';
import { Entity } from '../models';

/**
 * Classe que implementa um repositório de dados para uma determinada entidade.
 */
export abstract class Repository<T extends Entity> {
  /**
   * Find a entity by id.
   * 
   * @param Schema.Types.ObjectId entityId.
   */
  public async find(id: string): Promise<T> {
    return this.getModel().findById(id).lean().exec();
  }

  /**
   * Executa uma pesquisa por entidades.
   * 
   * @param filters filtros de pesquisa
   * @param sort ordenações
   * @param skip página
   * @param limit tamanho da página
   */
  public async search(filters: Object, sort?: Object, skip?: number, limit?: number): Promise<Array<T>> {
    const query = this.getModel().find(filters);

    if (skip) {
      query.skip(skip);
    }

    if (limit) {
      query.limit(limit);
    }

    if (sort) {
      query.sort(sort);
    }

    return query.lean().exec();
  }

  /**
   * Create a new record (document).
   * 
   * @param T entity
   */
  public async create(entity: T): Promise<Types.ObjectId> {
    const persitedEntity: T = await this.getModel().create(entity);

    return persitedEntity._id;
  }

  /**
   * Create a new record (document).
   * 
   * @param string id
   * @param T entity
   */
  public async update(id: string, entity: T): Promise<T> {
    return this.getModel().findByIdAndUpdate(id, entity).lean();
  }

  /**
   * Fina a entity by id.
   * 
   * @param Schema.Types.ObjectId entityId.
   */
  public async findAll(): Promise<Array<T>> {
    return this.getModel().find().lean().exec();
  }

  /**
   * Fina a entity by id.
   * 
   * @param Schema.Types.ObjectId entityId.
   */
  public async delete(id: string): Promise<T> {
    return this.getModel().findByIdAndDelete(id).lean();
  }

  /*------------------------------
   * Métodos de validação
   *------------------------------*/

  protected abstract getModel(): Model<T>;

}
