import * as Sequelize from "sequelize";
import config from "../../config";

import {
  RoleAttributes,
  RoleInstance,
  SequelizeAttributes,
} from '../../types/models';

export const RoleModel = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<RoleInstance, RoleAttributes> => {
  const attributes: SequelizeAttributes<RoleAttributes> = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      // autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.ENUM,
        values: ['regular', 'manager', 'globalManager'],
      allowNull: false,
      },
    };  
  

  const Role = sequelize.define<RoleInstance, RoleAttributes>(
    "role",
    attributes,
  );

  Role.associate = (models) => {
      Role.belongsTo(models.Group);
  }

  return Role;
}
