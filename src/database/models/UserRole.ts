
import * as Sequelize from "sequelize";

import {
  UserRoleAttributes,
  UserRoleInstance,
  SequelizeAttributes,
} from '../../types/models';

export const UserRoleModel = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<UserRoleInstance, UserRoleAttributes> => {
  const attributes: SequelizeAttributes<UserRoleAttributes> = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      // autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
  }
  

  const UserRole = sequelize.define<UserRoleInstance, UserRoleAttributes>(
    "user_roles",
    attributes,
    {timestamps: false}
  );

  return UserRole;
}
