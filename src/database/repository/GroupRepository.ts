import { Service, Inject } from 'typedi'
import { IModels, PaginationResult, GroupAttributes, GroupInstance } from '../../types/models'
import { logger } from '../../lib'
import { Sequelize } from 'sequelize'
import 'reflect-metadata'
import { UnprocessableEntityError } from '../../errors'

export interface IGroupRepository {
	exists(id: string): Promise<boolean>
	getAll({ offset, limit, conditions }: { offset: number; limit: number; conditions?: { [key: string]: any }}): Promise<PaginationResult<GroupAttributes>>
	getOne(findArgs: GroupAttributes, plain: boolean): Promise<GroupAttributes | null>
	save(group: GroupInstance): Promise<GroupAttributes | null>
	update(attributes: GroupAttributes, findArgs: GroupAttributes): Promise<GroupAttributes | null>
  delete(id: string) : Promise<number>
}

@Service()
export default class GroupRepository implements IGroupRepository {
	constructor(@Inject('models') private Models: IModels, @Inject('sequelize') private sequelize: Sequelize) {}

	async exists(id: string): Promise<boolean> {
		try {
			const GroupInstance = await this.Models.Group.findById(id)
			return !!GroupInstance === true
		} catch (error: any) {
			logger.error('GroupRepository: exists', error.message)
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
	}): Promise<PaginationResult<GroupAttributes>> {
		try {
			const result = await this.Models.Group.findAndCountAll({
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
			logger.error('GroupRepository: getAll', error.message)
			throw error
		}
	}

	async getOne(findArgs: GroupAttributes, plain: boolean): Promise<GroupAttributes | null> {
		try {
			const group = await this.Models.Group.findOne({
				where: { ...findArgs },
				include: [
					{
						model: this.Models.Collection
					}
				],
			})

      // return group;
			return group ? plain? group.get({ plain: true }) : group: null;
		} catch (error: any) {
			logger.error('GroupRepository: getOne', error.message)
			throw error
		}
	}

	async save(Group: GroupAttributes): Promise<GroupAttributes | null> {
		try {
			return await this.Models.Group.create(Group, { raw: true })
		} catch (error: any) {
			logger.error('GroupRepository: save', error.message)
			throw error
		}
	}

	async update(attributes: GroupAttributes, findArgs: GroupAttributes): Promise<GroupAttributes | null> {
		try {
			const updatedGroup = await this.Models.Group.update({ ...attributes }, { where: { ...findArgs } })

			if (!updatedGroup) throw new UnprocessableEntityError('Cannot update Group')

			// fetch updated data
			return await this.Models.Group.findOne({
				where: { ...findArgs },
				raw: true,
			})
		} catch (error: any) {
			logger.error('GroupRepository: update', error.message)
			throw error
		}
	}

	//delete Group
  public async delete(id: string) {
    try {
      return await this.Models.Group.destroy({
        where: { id },
      })
    
    } catch (error: any) {
      logger.error('GroupRepository : delete', error.message)
      throw error
    }
  }
	//#endregion
}
