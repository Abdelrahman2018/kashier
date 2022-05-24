import { Service } from "typedi";
import {
  CollectionRepository,
} from "../database/repository";
import { CollectionAttributes } from "../types/models";
import {
  UnprocessableEntityError,
  ConflictError,
  NotFoundError,
} from "../errors";
import { logger } from "../lib";

@Service()
class CollectionService {
  constructor(
    private readonly CollectionRepository: CollectionRepository,
  ) {}

  async exists(id: string) {
    return this.CollectionRepository.exists(id);
  }

  async getAll({ limit = 10, offset = 0 }: { limit: number; offset: number }) {
    return this.CollectionRepository.getAll({ limit, offset });
  }

  async getOne(findArgs: CollectionAttributes) {
    try {
      const collection: any = await this.CollectionRepository.getOne(findArgs);

      if (!collection) throw new UnprocessableEntityError("Collection does not exist!");

      return {
        ...collection,
        // treatedUsersCount,
      };
    } catch (error: any) {
      logger.error("CollectionService: getOne:", error.message);
      throw error;
    }
  }

  async create(collection: CollectionAttributes) {
    try {

      const findArgs = { name: collection?.name as string };

      const nameExists = await this.CollectionRepository.getOne(findArgs);

      if (nameExists) throw new ConflictError("Name already Exist!");

      const newCollection: any = await this.CollectionRepository.save(collection);

      return newCollection;
    } catch (error: any) {
      logger.error("CollectionService: create:", error.message);
      throw error;
    }
  }

  //#region Update User Service
  public async update(attributes: CollectionAttributes, findArgs: CollectionAttributes) {
    try {
      const collectionExists = await this.CollectionRepository.exists(findArgs.id as string);
      if (!collectionExists) {
        throw new NotFoundError("Group Not Exist");
      }

      const updatedColection = await this.CollectionRepository.update(attributes, findArgs);
      if (!updatedColection) {
        throw new UnprocessableEntityError("Collection Not Updated");
      }
      return updatedColection;
    } catch (error: any) {
      logger.error("CollectionService : update", error.message);
      throw error;
    }
  }
  //#endregion

  //#region Delete Collection Service
  public async delete(id: string) {
    try {
      const collectionExist = await this.CollectionRepository.exists(id); 
      if (!collectionExist) {
        throw new NotFoundError("Collection Not Exist");
      }

      const deletedCollection = await this.CollectionRepository.delete(id);
      if (!deletedCollection) {
        throw new UnprocessableEntityError("Collection Not Updated");
      }
      return deletedCollection;
    } catch (error: any) {
      logger.error("CollectionService : delete", error.message);
      throw error;
    }
  }
  //#endregion



}

export default CollectionService;
