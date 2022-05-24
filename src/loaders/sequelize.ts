import Sequelize from "sequelize";
import config from "../config";
import { logger } from "../lib";
import { createModels } from "../database/models";
import { IModels } from "../types/models";

const { SEQUELIZE_CONFIG } = config;

export interface sequelizeLoaderRes {
  models: IModels | undefined;
  sequelize: Sequelize.Sequelize;
}

async function sequelizeLoader(): Promise<sequelizeLoaderRes | undefined> {
  const { database, username, password, params } = SEQUELIZE_CONFIG;

  try {
    const sequelize = new Sequelize(database, username, password, params);

    const models = createModels(sequelize);

    // await sequelize.sync({ force: false, alter: false });

    return {
      models,
      sequelize,
    };
  } catch (error: any) {
    logger.error("😱 Failed to load sequelize: ", error.message);
    logger.error(error);
  }
}

export default sequelizeLoader;
