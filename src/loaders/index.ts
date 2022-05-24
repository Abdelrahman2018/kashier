import { Application } from "express";
import expressLoader from "./express";
import sequelizeLoader from "./sequelize";
import dependencyInjectorLoader from "./dependencyInjector";
import { logger } from "../lib";

const loader = async (app: Application) => {
  try {
    // await mongooseLoader();
    // logger.info(`🛸️ MongoDB loaded successfully`);

    const res = await sequelizeLoader();
    const { models, sequelize } = res || {};

    if (!sequelize || !models) {
      throw new Error("Failed to load dependency injector");
    } else {
      logger.info(`🪂 Sequelize loaded successfully`);
      await dependencyInjectorLoader({ models, sequelize });
      logger.info(`🚀 Dependency Injector loaded successfully`);
    }

    await expressLoader({ app });
    logger.info("💯 Express loaded successfully");
  } catch (error: any) {
    logger.error(error.message);
    logger.error(error);
  }
};

export default loader;
