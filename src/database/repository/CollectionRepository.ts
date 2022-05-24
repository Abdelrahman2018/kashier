import { Service, Inject } from 'typedi'
import { IModels, PaginationResult, CollectionAttributes, CollectionInstance } from '../../types/models'
import { logger } from '../../lib'
import { Sequelize } from 'sequelize'
import 'reflect-metadata'
import { UnprocessableEntityError } from '../../errors'

export interface ICollectionRepository {
	exists(id: string): Promise<boolean>
	getAll({ offset, limit, conditions }: { offset: number; limit: number; conditions?: { [key: string]: any }}): Promise<PaginationResult<CollectionAttributes>>
	getOne(findArgs: CollectionAttributes): Promise<CollectionAttributes | null>
	save(group: CollectionInstance): Promise<CollectionAttributes | null>
	update(attributes: CollectionAttributes, findArgs: CollectionAttributes): Promise<CollectionAttributes | null>
  delete(id: string) : Promise<number>
}

@Service()
export default class CollectionRepository implements ICollectionRepository {
	constructor(@Inject('models') private Models: IModels, @Inject('sequelize') private sequelize: Sequelize) {}

	async exists(id: string): Promise<boolean> {
		try {
			const CollectionInstance = await this.Models.Collection.findById(id)
			return !!CollectionInstance === true
		} catch (error: any) {
			logger.error('CollectionRepository: exists', error.message)
			throw error
		}
	}

	async getAll({
		limit,
		offset,
		conditions = {},
	}: {
		limit: number
		offset: number
		conditions?: { [key: string]: any }
	}): Promise<PaginationResult<CollectionAttributes>> {
		try {
			const result = await this.Models.Collection.findAndCountAll({
				offset,
				limit,
				where: { ...conditions },
        include: [
          {
            model: this.Models.Item
          }
        ]
			})

			return {
				docs: result.rows,
				total: result.count,
				pages: Math.ceil(result.count / limit),
			}
		} catch (error: any) {
			logger.error('CollectionRepository: getAll', error.message)
			throw error
		}
	}

	async getOne(findArgs: CollectionAttributes): Promise<CollectionAttributes | null> {
		try {
			const collection = await this.Models.Collection.findOne({
				where: { ...findArgs },
        include: [
          {
            model: this.Models.Item
          }
        ]
			})

			return collection ? collection?.get({ plain: true }) : null
		} catch (error: any) {
			logger.error('CollectionRepository: getOne', error.message)
			throw error
		}
	}

	async save(collection: CollectionAttributes): Promise<CollectionAttributes | null> {
		try {
			return await this.Models.Collection.create(collection, { raw: true })
		} catch (error: any) {
			logger.error('CollectionRepository: save', error.message)
			throw error
		}
	}

	async update(attributes: CollectionAttributes, findArgs: CollectionAttributes): Promise<CollectionAttributes | null> {
		try {
			const updatedCollection = await this.Models.Collection.update({ ...attributes }, { where: { ...findArgs } })

			if (!updatedCollection) throw new UnprocessableEntityError('Cannot update Collection')

			// fetch updated data
			return await this.Models.Collection.findOne({
				where: { ...findArgs },
				raw: true,
			})
		} catch (error: any) {
			logger.error('CollectionRepository: update', error.message)
			throw error
		}
	}

  public async delete(id: string) {
    try {
      return await this.Models.Collection.destroy({
        where: { id },
      })
    
    } catch (error: any) {
      logger.error('CollectionRepository : delete', error.message)
      throw error
    }
  }
	//#endregion
}
