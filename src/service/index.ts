import { Types } from 'mongoose';
import { EntityNotFound, InvalidIdentifier } from '../errors';
import { Entity } from '../models';
import { Repository } from '../repository';

/**
 * Classe abstrata que implementa serviços básicos para gestão de entidades.
 */
export abstract class Service<T extends Entity> {
  /**
   * Cria um registro
   * 
   * @param {T} entity objeto a ser savo.
   */
  public async create(entity: T): Promise<string> {
    await this.createValidation(entity);

    const id = await this.getRepository().create(entity);

    return id.toString();
  }

  /**
   * Atualiza os dados de uma entidade.
   * 
   * @param {string} id identificador da entidade a ser atualizada
   * @param {T} entity entidade a ser atualizada
   */
  public async update(id: string, entity: T): Promise<void> {
    this.validateId(id);

    await this.updateValidation(id, entity);

    const updatedEntity: T = await this.getRepository().update(id, entity);

    if (!updatedEntity) {
      throw new EntityNotFound('No resesource found for update');
    }
  }

  /**
   * Recupera uma entidade pelo identificador.
   * 
   * @param {string} id identificador da entidade
   */
  public async find(id: string): Promise<T> {
    const entity: T = await this.getRepository().find(id);

    if (!entity) {
      throw new EntityNotFound('No resesource found');
    }

    return entity;
  }

  /**
   * Exclui uma entidade pelo identificador.
   * 
   * @param id identificador da entidade
   * @throws {EntityNotFound} exceção lançada se não existir a entidade com identificador informado
   */
  public async delete(id: string): Promise<void> {
    this.validateId(id);

    await this.deleteValidation(id);

    const entity: T = await this.getRepository().delete(id);

    if (!entity) {
      throw new EntityNotFound('No resource found for remove');
    }
  }

  /**
   * Executa uma consulta por entidades
   * @param {Object} filter filtros de pesquisa
   * @param sort
   * @param skip
   * @param limit
   */
  public async search(filter: Object, sort?: Object, skip?: number, limit?: number): Promise<Array<T>> {
    return this.getRepository().search(filter, sort, skip, limit);
  }

  /*---------------------------------
   * Métodos auxiliares
   *--------------------------------*/

  /**
   * Verifica se o identificador é um ObjectId do mongo válido. 
   * @param {string} id identificador 
   */
  protected validateId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new InvalidIdentifier('');
    }
  }

  protected async deleteValidation(id: string): Promise<void> {
    // no action
  }

  protected async createValidation(entity: T): Promise<void> {
    // no action
  }

  protected async updateValidation(id: string, entity: T): Promise<void> {
    // no action
  }

  /**
   * Retorna a instância do objeto no padrão respositório parametrizado pelo tipo da entidade.
   */
  protected abstract getRepository(): Repository<T>;
}
