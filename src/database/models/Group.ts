import * as Sequelize from "sequelize";
import config from "../../config";

import {
  GroupAttributes,
  GroupInstance,
  SequelizeAttributes,
} from '../../types/models';

export const GroupModel = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<GroupInstance, GroupAttributes> => {
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
    };  
  

  const Group = sequelize.define<GroupInstance, GroupAttributes>(
    "group",
    attributes,
  );
  Group.associate = (models) => {
      Group.belongsToMany(models.User, {
          through: 'user_groups',
          timestamps: false,
      });
      Group.hasMany(models.Collection, {
        onDelete: 'cascade'
      });
      Group.hasMany(models.Role, {
        onDelete: 'cascade'
      });
  }

  return Group;
}
