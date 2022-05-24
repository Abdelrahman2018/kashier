import * as Sequelize from 'sequelize'
import { userRoles } from '../../types/general'

import { GroupAttributes, GroupInstance, RoleAttributes, SequelizeAttributes } from '../../types/models'

export const GroupModel = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<GroupInstance, GroupAttributes> => {
	const attributes: SequelizeAttributes<GroupAttributes> = {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			// autoIncrement: true,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
	}

	const Group = sequelize.define<GroupInstance, GroupAttributes>('group', attributes, {
		// hooks: {
		// 	afterCreate: (group) => {
    //     sequelize.models.Role.create({
    //       name: "role",
    //       groupId: group.id,
    //     })
    //   },
		// },
	})
	Group.associate = (models) => {
		Group.belongsToMany(models.User, {
			through: 'user_groups',
			timestamps: false,
		})
		Group.hasMany(models.Collection, {
			onDelete: 'cascade',
		})
		Group.hasMany(models.Role, {
			onDelete: 'cascade',
		})
	}

	Group.addHook('afterCreate', (group: GroupAttributes) => {
		userRoles.forEach((role: string) => {
			console.log('role', role)
			sequelize.models.role.create({
				name: role,
				groupId: group.id,
			})
		})
	})

	// Group.afterCreate((models) => {
	//   models.Role.C
	// })

	return Group
}
