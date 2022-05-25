import * as Sequelize from "sequelize";
import { IModels } from "../../types/models";
import { GroupModel } from "./Group";
import { CollectionModel } from "./Collection";
import { ItemModel } from "./Item";
import { UserModel } from "./User";
import { RoleModel } from "./Role";
import { UserGroupModel } from "./UserGroup";
import { UserRoleModel } from "./UserRole";
export const createModels = (sequelize: Sequelize.Sequelize): IModels => {
  /**
   * Register models here
   * and sort alphabetically, please
   */
  const models: IModels = {
    Group: GroupModel(sequelize, Sequelize),
    Collection: CollectionModel(sequelize, Sequelize),
    Item: ItemModel(sequelize, Sequelize),
    User: UserModel(sequelize, Sequelize),
    Role: RoleModel(sequelize, Sequelize),
    UserGroup: UserGroupModel(sequelize, Sequelize),
    UserRole: UserRoleModel(sequelize, Sequelize),
  };

  Object.keys(models).forEach((modelName) => {
    if ("associate" in models[modelName as any]) {
      models[modelName as any].associate(models);
    }
  });

  return models;
};
