import * as Sequelize from "sequelize";
import config from "../../config";

import {
  CollectionAttributes,
  CollectionInstance,
  SequelizeAttributes,
} from '../../types/models';

export const CollectionModel = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<CollectionInstance, CollectionAttributes> => {
  const attributes: SequelizeAttributes<CollectionAttributes> = {
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
  

  const Collection = sequelize.define<CollectionInstance, CollectionAttributes>(
    "collection",
    attributes,
  );

  Collection.associate = (models) => {
      Collection.belongsTo(models.Group);
      Collection.hasMany(models.Item, {
        onDelete: 'cascade'
      });
  }

  return Collection;
}
