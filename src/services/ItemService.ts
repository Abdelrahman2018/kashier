import { Service } from "typedi";
import {
  ItemRepository,
} from "../database/repository";
import { ItemAttributes } from "../types/models";
import {
  UnprocessableEntityError,
  ConflictError,
  NotFoundError,
} from "../errors";
import { logger } from "../lib";

@Service()
class ItemService {
  constructor(
    private readonly ItemRepository: ItemRepository,
  ) {}

  async exists(id: string) {
    return this.ItemRepository.exists(id);
  }

  async getAll({ limit = 10, offset = 0 }: { limit: number; offset: number }) {
    return this.ItemRepository.getAll({ limit, offset });
  }

  async getOne(findArgs: ItemAttributes) {
    try {
      const item: any = await this.ItemRepository.getOne(findArgs);

      if (!item) throw new UnprocessableEntityError("Item does not exist!");

      return {
        ...item,
        // treatedUsersCount,
      };
    } catch (error: any) {
      logger.error("ItemService: getOne:", error.message);
      throw error;
    }
  }

  async create(item: ItemAttributes) {
    try {

      const newItem: any = await this.ItemRepository.save(item);

      return newItem;
    } catch (error: any) {
      logger.error("ItemService: create:", error.message);
      throw error;
    }
  }

  //#region Update Item Service
  public async update(attributes: ItemAttributes, findArgs: ItemAttributes) {
    try {
      const itemExists = await this.ItemRepository.exists(findArgs.id as string);
      if (!itemExists) {
        throw new NotFoundError("Item Not Exist");
      }

      const updatedItem = await this.ItemRepository.update(attributes, findArgs);
      if (!updatedItem) {
        throw new UnprocessableEntityError("Item Not Updated");
      }
      return updatedItem;
    } catch (error: any) {
      logger.error("ItemService : update", error.message);
      throw error;
    }
  }
  //#endregion

  //#region Delete Item Service
  public async delete(id: string) {
    try {
      const itemExist = await this.ItemRepository.exists(id); 
      if (!itemExist) {
        throw new NotFoundError("Item Not Exist");
      }

      const deletedItem = await this.ItemRepository.delete(id);
      if (!deletedItem) {
        throw new UnprocessableEntityError("Item Not Updated");
      }
      return deletedItem;
    } catch (error: any) {
      logger.error("ItemService : delete", error.message);
      throw error;
    }
  }
  //#endregion



}

export default ItemService;
