import { Errors, Return } from 'typescript-rest';
import { EntityNotFound } from '../errors';
import { Entity } from '../models';
import { Service } from '../service';

/**
 * Classe que implementa um repositório de dados para uma determinada entidade.
 */
export abstract class Controller<T extends Entity> {
  /**
   * Cria um registro
   * 
   * @param {T} entity objeto a ser savo.
   * @returns {Promise<Return.NewResource<T>>} identificador do registro criado
   */
  public async create(entity: T): Promise<Return.NewResource<T>> {
    const id = await this.getService().create(entity);

    return new Return.NewResource(id);
  }

  /**
   * Atualiza os dados de uma entidade.
   * 
   * @param {string} id identificador da entidade a ser atualizada
   * @param {T} entity entidade a ser atualizada
   */
  public async update(id: string, entity: T) {
    try {
      await this.getService().update(id, entity);
    } catch (err) {
      if (err instanceof EntityNotFound) {
        throw new Errors.NotFoundError();
      }
      throw err;
    }
  }

  /**
   * Recupera uma entidade pelo identificador.
   * 
   * @param {string} id identificador da entidade
   * @returns {Promise<T>} entidade recuperdaa
   */
  public async find(id: string): Promise<T> {
    try {
      const entity = await this.getService().find(id);

      return entity;
    } catch (err) {
      if (err instanceof EntityNotFound) {
        throw new Errors.NotFoundError();
      }
      throw err;
    }
  }

  /**
   * Exclui uma entidade pelo identificador.
   * 
   * @param id identificador da entidade
   */
  public async delete(id: string): Promise<void> {
    try {
      await this.getService().delete(id);
    } catch (err) {
      if (err instanceof EntityNotFound) {
        throw new Errors.NotFoundError();
      }
      throw err;
    }
  }

  /**
   * Executa uma consulta por entidades
   * 
   * @param {Object} filter filtros de pesquisa
   * @param {Object} ordenações da pesquisa
   * @param {Number} skip número da página de resultado da pesquisa
   * @param {Number} limit tamanho da página de resultado da pesquisa
   */
  public async search(filter: Object, sort?: Object, skip?: number, limit?: number): Promise<Array<T>> {
    return this.getService().search(filter, sort, skip, limit);
  }

  /**
   * Retorna a instância da classe no padrão respositório parametrizado pelo tipo da entidade.
   * 
   * @returns {Service<T>} instância da classe
   */
  protected abstract getService(): Service<T>;

}
