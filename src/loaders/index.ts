import { Application } from "express";
import expressLoader from "./express";
import sequelizeLoader from "./sequelize";
import dependencyInjectorLoader from "./dependencyInjector";
import { logger } from "../lib";

const loader = async (app: Application) => {
  try {
    // await mongooseLoader();
    // logger.info(`πΈοΈ MongoDB loaded successfully`);

    const res = await sequelizeLoader();
    const { models, sequelize } = res || {};

    if (!sequelize || !models) {
      throw new Error("Failed to load dependency injector");
    } else {
      logger.info(`πͺ Sequelize loaded successfully`);
      await dependencyInjectorLoader({ models, sequelize });
      logger.info(`π Dependency Injector loaded successfully`);
    }

    await expressLoader({ app });
    logger.info("π― Express loaded successfully");
  } catch (error: any) {
    logger.error(error.message);
    logger.error(error);
  }
};

export default loader;
