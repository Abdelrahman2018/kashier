
import * as Sequelize from "sequelize";
import config from "../../config";

import {
  UserGroupAttributes,
  UserGroupInstance,
  SequelizeAttributes,
} from '../../types/models';

export const UserGroupModel = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<UserGroupInstance, UserGroupAttributes> => {
  const attributes: SequelizeAttributes<UserGroupAttributes> = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      // autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
  }
  

  const UserGroup = sequelize.define<UserGroupInstance, UserGroupAttributes>(
    "user_groups",
    attributes,
    {timestamps: false}
  );

  return UserGroup;
}
