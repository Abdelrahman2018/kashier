import sequelize, * as Sequelize from "sequelize";
import { DataTypeAbstract, DefineAttributeColumnOptions } from "sequelize";
import { IObjectKeys } from "./general";

/**
 * global
 */
export type SequelizeAttribute =
  | string
  | DataTypeAbstract
  | DefineAttributeColumnOptions;

export type SequelizeAttributes<T extends { [key: string]: any }> = {
  [P in keyof T]: SequelizeAttribute;
};

export interface GroupAttributes {
  id?: string;
  name?: string;
}

export interface GroupInstance
  extends Sequelize.Instance<GroupAttributes>,
  GroupAttributes {}


export interface CollectionAttributes {
  id?: string;
  name?: string;
  groupId?: string;
}

export interface CollectionInstance
  extends Sequelize.Instance<CollectionAttributes>,
  CollectionAttributes {}


export interface ItemAttributes {
  id?: string;
  name?: string;
  collectionId?: string;
}

export interface ItemInstance
  extends Sequelize.Instance<ItemAttributes>,
  ItemAttributes {}


export interface UserAttributes {
  id?: string;
  email?: string;
  groupId?: string;
  role?: string;
  accessToken?: string;
}

export interface UserInstance
  extends Sequelize.Instance<UserAttributes>,
  UserAttributes {}

export interface RoleAttributes {
  id?: string;
  name?: string;
  groupId?: string;
}


export interface UserGroupAttributes {
  id?: string;
  userId?: string;
  groupId?: string;
}

export interface UserGroupInstance
  extends Sequelize.Instance<UserGroupAttributes>,
  UserGroupAttributes {}

export interface RoleInstance
  extends Sequelize.Instance<RoleAttributes>,
  RoleAttributes {}

export interface IModels extends IObjectKeys {
  Group: Sequelize.Model<GroupInstance, GroupAttributes>;
  Collection: Sequelize.Model<CollectionInstance, CollectionAttributes>;
  Item: Sequelize.Model<ItemInstance, ItemAttributes>;
  User: Sequelize.Model<UserInstance, UserAttributes>;
  UserGroup: Sequelize.Model<UserGroupInstance, UserGroupAttributes>;
  Role: Sequelize.Model<RoleInstance, RoleAttributes>;
}

export type PaginationResult<I> = {
  docs: I[];
  total: number;
  pages: number;
};