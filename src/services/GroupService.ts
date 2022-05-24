import { Service } from "typedi";
import {
  GroupRepository,
} from "../database/repository";
import { GroupAttributes } from "../types/models";
import {
  UnprocessableEntityError,
  ConflictError,
  NotFoundError,
} from "../errors";
import { logger } from "../lib";

@Service()
class GroupService {
  constructor(
    private readonly GroupRepository: GroupRepository,
  ) {}

  async exists(id: string) {
    return this.GroupRepository.exists(id);
  }

  async getAll({ limit = 10, offset = 0 }: { limit: number; offset: number }) {
    return this.GroupRepository.getAll({ limit, offset });
  }

  async getOne(findArgs: GroupAttributes) {
    try {
      const group: any = await this.GroupRepository.getOne(findArgs, true);

      if (!group) throw new UnprocessableEntityError("Group does not exist!");

      return {
        ...group,
        // treatedUsersCount,
      };
    } catch (error: any) {
      logger.error("GroupService: getOne:", error.message);
      throw error;
    }
  }

  async create(group: GroupAttributes) {
    try {

      const findArgs = { name: group?.name as string };

      const nameExists = await this.GroupRepository.getOne(findArgs, true);

      if (nameExists) throw new ConflictError("Name already Exist!");

      const newGroup: any = await this.GroupRepository.save(group);

      return newGroup;
    } catch (error: any) {
      logger.error("GroupService: create:", error.message);
      throw error;
    }
  }

  //#region Update User Service
  public async update(attributes: GroupAttributes, findArgs: GroupAttributes) {
    try {
      const groupExists = await this.GroupRepository.exists(findArgs.id as string);
      if (!groupExists) {
        throw new NotFoundError("Group Not Exist");
      }

      const updatedGroup = await this.GroupRepository.update(attributes, findArgs);
      if (!updatedGroup) {
        throw new UnprocessableEntityError("Group Not Updated");
      }
      return updatedGroup;
    } catch (error: any) {
      logger.error("GroupService : update", error.message);
      throw error;
    }
  }
  //#endregion

  //#region Delete Group Service
  public async delete(groupId: string) {
    try {
      const groupExists = await this.GroupRepository.exists(groupId); 
      if (!groupExists) {
        throw new NotFoundError("Group Not Exist");
      }

      const deletedGroup = await this.GroupRepository.delete(groupId);
      if (!deletedGroup) {
        throw new UnprocessableEntityError("Group Not Updated");
      }
      return deletedGroup;
    } catch (error: any) {
      logger.error("GroupService : delete", error.message);
      throw error;
    }
  }
  //#endregion



}

export default GroupService;
