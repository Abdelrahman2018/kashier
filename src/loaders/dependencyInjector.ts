import { Container } from 'typedi';
import { Sequelize } from 'sequelize';
import { logger } from '../lib';
import { IModels } from '../types/models';

type Props = {
  models: IModels;
  sequelize: Sequelize;
};
const dependencyInjectorLoader = async ({ models, sequelize }: Props) => {
  try {
    Container.set('models', models);
    Container.set('sequelize', sequelize);
  } catch (error: any) {
    logger.error('😱 Failed to load dependency injector: ', error.message);
    logger.error(error);
  }
};

export default dependencyInjectorLoader;
