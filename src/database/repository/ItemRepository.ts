import { Service, Inject } from 'typedi'
import { IModels, PaginationResult, ItemAttributes, ItemInstance } from '../../types/models'
import { logger } from '../../lib'
import { Sequelize } from 'sequelize'
import 'reflect-metadata'
import { UnprocessableEntityError } from '../../errors'

export interface IItemRepository {
	exists(id: string): Promise<boolean>
	getAll({ offset, limit, conditions }: { offset: number; limit: number; conditions?: { [key: string]: any }}): Promise<PaginationResult<ItemAttributes>>
	getOne(findArgs: ItemAttributes): Promise<ItemAttributes | null>
	save(group: ItemInstance): Promise<ItemAttributes | null>
	update(attributes: ItemAttributes, findArgs: ItemAttributes): Promise<ItemAttributes | null>
  delete(id: string) : Promise<number>
}

@Service()
export default class ItemRepository implements IItemRepository {
	constructor(@Inject('models') private Models: IModels, @Inject('sequelize') private sequelize: Sequelize) {}

	async exists(id: string): Promise<boolean> {
		try {
			const ItemInstance = await this.Models.Item.findById(id)
			return !!ItemInstance === true
		} catch (error: any) {
			logger.error('ItemRepository: exists', error.message)
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
	}): Promise<PaginationResult<ItemAttributes>> {
		try {
			const result = await this.Models.Item.findAndCountAll({
				offset,
				limit,
				where: { ...conditions },
        include: [
          {
            model: this.Models.Collection
          }
        ]
			})

			return {
				docs: result.rows,
				total: result.count,
				pages: Math.ceil(result.count / limit),
			}
		} catch (error: any) {
			logger.error('ItemRepository: getAll', error.message)
			throw error
		}
	}

	async getOne(findArgs: ItemAttributes): Promise<ItemAttributes | null> {
		try {
			const item = await this.Models.Item.findOne({
				where: { ...findArgs },
        include: [
          {
            model: this.Models.Collection
          }
        ]
			})

			return item ? item?.get({ plain: true }) : null
		} catch (error: any) {
			logger.error('ItemRepository: getOne', error.message)
			throw error
		}
	}

	async save(item: ItemAttributes): Promise<ItemAttributes | null> {
		try {
			return await this.Models.Item.create(item, { raw: true })
		} catch (error: any) {
			logger.error('ItemRepository: save', error.message)
			throw error
		}
	}

	async update(attributes: ItemAttributes, findArgs: ItemAttributes): Promise<ItemAttributes | null> {
		try {
			const updatedItem = await this.Models.Item.update({ ...attributes }, { where: { ...findArgs } })

			if (!updatedItem) throw new UnprocessableEntityError('Cannot update Item')

			// fetch updated data
			return await this.Models.Item.findOne({
				where: { ...findArgs },
				raw: true,
			})
		} catch (error: any) {
			logger.error('ItemRepository: update', error.message)
			throw error
		}
	}

  public async delete(id: string) {
    try {
      return await this.Models.Item.destroy({
        where: { id },
      })
    
    } catch (error: any) {
      logger.error('ItemRepository : delete', error.message)
      throw error
    }
  }
	//#endregion
}
