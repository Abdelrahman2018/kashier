import { Service } from "typedi";
import {
  ContactRepository,
  DoctorRepositiory,
  UserRepositiory,
} from "../database/repository";
import { ContactAttributes } from "../types/models";
import { logger } from "../lib";
import { UserType } from "../types/general";
import { NotFoundError } from "../errors";

@Service()
class ContactService {
  constructor(
    private readonly ContactRepository: ContactRepository,
    private readonly DoctorRepository: DoctorRepositiory,
    private readonly UserRepository: UserRepositiory
  ) {}

  //#region Create Feedback Service
  public async create(newFeedback: ContactAttributes) {
    try {
      if (newFeedback.userType === UserType.doctor) {
        const doctorExist = await this.DoctorRepository.findDoctor({
          email: newFeedback.email,
        });
        if (!doctorExist) throw new NotFoundError("Doctor Not Found");
      } else if (newFeedback.userType === UserType.user) {
        const userExist = await this.UserRepository.findUser({
          email: newFeedback.email,
        });
        if (!userExist) throw new NotFoundError("User Does not Exist");
      }
      return await this.ContactRepository.create(newFeedback);
    } catch (error: any) {
      logger.error("Contactserivce : create : ", error.message);
      throw error;
    }
  }
  //#endregion
}

export default ContactService;
