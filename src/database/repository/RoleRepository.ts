import { Service, Inject } from 'typedi'
import { IModels, PaginationResult, RoleAttributes, RoleInstance } from '../../types/models'
import { logger } from '../../lib'
import { Sequelize } from 'sequelize'
import 'reflect-metadata'

export interface IRoleRepository {
	getOne(findArgs: RoleAttributes, plain: boolean): Promise<RoleAttributes | null>
	save(group: RoleInstance): Promise<RoleAttributes | null>
}

@Service()
export default class RoleRepository implements IRoleRepository {
	constructor(@Inject('models') private Models: IModels, @Inject('sequelize') private sequelize: Sequelize) {}

	async getAll({
		limit,
		offset,
		conditions = {},
	}: {
		limit: number
		offset: number
		conditions?: { [key: string]: any }
	}): Promise<PaginationResult<RoleAttributes>> {
		try {
			const result = await this.Models.Role.findAndCountAll({
				offset,
				limit,
				where: { ...conditions },
                include: [
                {
                    model: this.Models.Group
                }
                ]
			})

			return {
				docs: result.rows,
				total: result.count,
				pages: Math.ceil(result.count / limit),
			}
		} catch (error: any) {
			logger.error('RoleRepository: getAll', error.message)
			throw error
		}
	}

	async getOne(findArgs: RoleAttributes, plain: boolean): Promise<RoleAttributes | null> {
		try {
			const role = await this.Models.Role.findOne({
				where: { ...findArgs }
			})

      return role ? plain? role.get({ plain: true }) : role: null;
		} catch (error: any) {
			logger.error('RoleRepository: getOne', error.message)
			throw error
		}
	}

	async save(item: RoleAttributes): Promise<RoleAttributes | null> {
		try {
			return await this.Models.Item.create(item, { raw: true })
		} catch (error: any) {
			logger.error('RoleRepository: save', error.message)
			throw error
		}
	}

	//#endregion
}
