import { Service, Inject } from 'typedi'
import { IModels, PaginationResult, UserAttributes, UserInstance } from '../../types/models'
import { logger } from '../../lib'
import { Sequelize } from 'sequelize'
import 'reflect-metadata'
import { UnprocessableEntityError } from '../../errors'

export interface IUserRepository {
	exists(id: string): Promise<boolean>
	getAll({ offset, limit, conditions }: { offset: number; limit: number; conditions?: { [key: string]: any }}): Promise<PaginationResult<UserAttributes>>
	getOne(findArgs: UserAttributes): Promise<UserAttributes | null>
	save(user: UserInstance): Promise<UserAttributes | null>
	update(attributes: UserAttributes, findArgs: UserAttributes, raw: boolean): Promise<UserAttributes | null>
  deleteUser(userId: string) : Promise<number>
}

@Service()
export default class UserRepository implements IUserRepository {
	constructor(@Inject('models') private Models: IModels, @Inject('sequelize') private sequelize: Sequelize) {}

	async exists(id: string): Promise<boolean> {
		try {
			const UserInstance = await this.Models.User.findById(id)
			return !!UserInstance === true
		} catch (error: any) {
			logger.error('UserRepository: exists', error.message)
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
	}): Promise<PaginationResult<UserAttributes>> {
		try {
			const result = await this.Models.User.findAndCountAll({
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
			logger.error('UserRepository: getAll', error.message)
			throw error
		}
	}

	async getOne(findArgs: UserAttributes): Promise<UserAttributes | null> {
		try {
			const User = await this.Models.User.findOne({
				where: { ...findArgs },
        include: [
          {
            model: this.Models.Group
          }
        ]
			})

			return User ? User?.get({ plain: true }) : null
		} catch (error: any) {
			logger.error('UserRepository: getOne', error.message)
			throw error
		}
	}

	async save(user: UserAttributes): Promise<UserAttributes | null> {
		try {
			return  await this.Models.User.create(user)
		} catch (error: any) {
			logger.error('UserRepository: save', error.message)
			throw error
		}
	}

	async update(attributes: UserAttributes, findArgs: UserAttributes, raw: boolean): Promise<UserAttributes | null> {
		try {
			const updatedUser = await this.Models.User.update({ ...attributes }, { where: { ...findArgs } })

			if (!updatedUser) throw new UnprocessableEntityError('Cannot update User')

			// fetch updated data
			return await this.Models.User.findOne({
				where: { ...findArgs },
				raw,
			})
		} catch (error: any) {
			logger.error('UserRepository: update', error.message)
			throw error
		}
	}

	//delete user
  public async deleteUser(userId: string) {
    try {
      return await this.Models.User.destroy({
        where: { id: userId },
      })
    
    } catch (error: any) {
      logger.error('UserRepository : deleteUser', error.message)
      throw error
    }
  }
	//#endregion
}
