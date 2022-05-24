import * as Sequelize from "sequelize";
import config from "../../config";

import {
  UserAttributes,
  UserInstance,
  SequelizeAttributes,
} from '../../types/models';

export const UserModel = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<UserInstance, UserAttributes> => {
  const attributes: SequelizeAttributes<UserAttributes> = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
        unique: true,
      },
    };  
  

  const User = sequelize.define<UserInstance, UserAttributes>(
    "user",
    attributes,
  );

  User.associate = (models) => {
      User.belongsToMany(models.Group, {
          through: 'user_groups',
          timestamps: false,
          onDelete: 'cascade'
      });
  }

  return User;
}
