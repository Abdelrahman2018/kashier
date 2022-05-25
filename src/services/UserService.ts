import { Service } from "typedi";
import {generateAccessToken} from "../utils/jwt";
import {
  GroupRepository,
  UserRepository,
  RoleRepository,
} from "../database/repository";
import { RoleAttributes, UserAttributes } from "../types/models";
import {
  UnprocessableEntityError,
  ConflictError,
  NotFoundError,
} from "../errors";
import { logger } from "../lib";
import { JWTPayload } from "../types/general";

@Service()
class UserService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly GroupRepository: GroupRepository,
    private readonly RoleRepository: RoleRepository,
  ) {}

  async exists(id: string) {
    return this.UserRepository.exists(id);
  }

  async getAll({ limit = 10, offset = 0 }: { limit: number; offset: number }) {
    return this.UserRepository.getAll({ limit, offset });
  }

  async getOne(findArgs: UserAttributes) {
    try {
      const User: any = await this.UserRepository.getOne(findArgs);

      if (!User) throw new UnprocessableEntityError("User does not exist!");

      return {
        ...User,
        // treatedUsersCount,
      };
    } catch (error: any) {
      logger.error("UserService: getOne:", error.message);
      throw error;
    }
  }

  async create(user: UserAttributes) {
    try {
      let role: string | RoleAttributes[];
      let token: string;
      const findArgs = { email: user?.email as string };

      const emailExists = await this.UserRepository.getOne(findArgs);

      if (emailExists) throw new ConflictError("Email already Exist!");

      const newUser: any = await this.UserRepository.save(user);
     
      if (user.groupId && user.role !== "globalManager") {
        const group: any = await this.GroupRepository.getOne({ id: user.groupId }, false);
        const roleGroup: any = await this.RoleRepository.getOne({name: user.role, groupId: user.groupId}, false);
        await group.addUser(newUser);
        await newUser.addRole(roleGroup);
        
        const updatedUserWithRoles: any = await this.UserRepository.getOne({id: newUser.id})
        role = updatedUserWithRoles.roles;
      }else{
        role = "globalManager";
      }
      // sign jwt token
      token = generateAccessToken(newUser?.id as string, role);
      newUser.dataValues.accessToken = token;

      return newUser;
    } catch (error: any) {
      logger.error("UserService: create:", error.message);
      throw error;
    }
  }

  //#region Update User Service
  public async update(attributes: UserAttributes, findArgs: UserAttributes) {
    try {
      const UserExists = await this.UserRepository.exists(findArgs.id as string);
      if (!UserExists) {
        throw new NotFoundError("User Not Exist");
      }

      const updatedUser: any = await this.UserRepository.update(attributes, findArgs, false);
      if (!updatedUser) {
        throw new UnprocessableEntityError("User Not Updated");
      }

      if(attributes.groupId && attributes.role){
        const group: any = await this.GroupRepository.getOne({id: attributes.groupId}, false);
        const roleGroup: any = await this.RoleRepository.getOne({name: attributes.role, groupId: attributes.groupId}, false);
        await group.addUser(updatedUser);
        await updatedUser.addRole(roleGroup);
        const DBUser: any = await this.UserRepository.getOne({id: updatedUser.id});
    
        const token = generateAccessToken(updatedUser.id as string, DBUser.roles);
        updatedUser.dataValues.accessToken = token;
      }
      return updatedUser;
    } catch (error: any) {
      logger.error("UserService : update", error.message);
      throw error;
    }
  }
  //#endregion

  //#region Delete User Service
  public async deleteUser(userId: string) {
    try {
      const UserExists = await this.UserRepository.exists(userId); 
      if (!UserExists) {
        throw new NotFoundError("User Not Exist");
      }

      const deletedUser = await this.UserRepository.deleteUser(userId);
      if (!deletedUser) {
        throw new UnprocessableEntityError("User Not Updated");
      }
      return deletedUser;
    } catch (error: any) {
      logger.error("UserService : deleteUser", error.message);
      throw error;
    }
  }
  //#endregion



}

export default UserService;
