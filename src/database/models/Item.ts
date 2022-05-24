import * as Sequelize from "sequelize";
import config from "../../config";

import {
  ItemAttributes,
  ItemInstance,
  SequelizeAttributes,
} from '../../types/models';

export const ItemModel = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<ItemInstance, ItemAttributes> => {
  const attributes: SequelizeAttributes<ItemAttributes> = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      // autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      },
    };  
  

  const Item = sequelize.define<ItemInstance, ItemAttributes>(
    "item",
    attributes,
  );

  Item.associate = (models) => {
      Item.belongsTo(models.Collection);
  }

  return Item;
}
