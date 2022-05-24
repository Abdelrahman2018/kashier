import { logger } from "../lib";
import { Service } from "typedi";
import { ConflictError, UnauthorizedError } from "../errors";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import {AdminRepository} from "../database/repository";
import { tokenPair } from "../types/general";

@Service()
class AdminService {
  constructor(
      private readonly AdminRepository: AdminRepository,
    ) {}

  /**
   * Admin getTokens auth service
   */
   async getTokens({
    id,
    role,
  }: {
    id: string;
    role: string;
  }): Promise<tokenPair> {
    const accessToken = generateAccessToken(id, role);
    const refreshToken = generateRefreshToken(id);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  
}

export default AdminService;