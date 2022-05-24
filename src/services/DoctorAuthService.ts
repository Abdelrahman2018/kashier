import { Service } from "typedi";
import { DoctorRepositiory, } from "../database/repository";
import { passwordUtils, jwtUtils } from "../utils";
import { tokenPair } from "../types/general";
import { UnauthorizedError } from "../errors";
import { logger, mailer, speakeasy } from "../lib";

@Service()
class AuthService {
  constructor(
    private readonly DoctorRepositiory: DoctorRepositiory,
  ) {}

  /**
   * Doctor login auth service
   */
  async login({
    email,
    password,
    fcmToken,
    deviceId,
  }: {
    email: string;
    password: string;
    fcmToken?: string;
    deviceId: string;
  }) {
    const findArg = { email };

    try {
      const doctor = await this.DoctorRepositiory.findDoctor(findArg);
      if (!doctor) throw new UnauthorizedError("Email doesn't Exist!");

      // add fcmToken to doctor database
      if (fcmToken && deviceId) {
        const fcmTokenParams = {doctor_id: doctor.id!, token: fcmToken, deviceId};
        const fcmTokenFindArgs = {doctor_id: doctor.id!, deviceId};
      }

      const hashedPassword = doctor!.password as string;
      const passwordMatch = await passwordUtils.verifyPassword(
        password,
        hashedPassword
      );

      if (!passwordMatch) throw new UnauthorizedError("Invalid password");


      delete doctor.password;
      delete doctor.visits;

      return { ...doctor };
    } catch (error: any) {
      logger.error("AuthService: login:", error.message);
      throw error;
    }
  }

  /**
   * Doctor forget password auth service
   */
  async forgetPassword(email: string) {
    const { sendEmail } = mailer();
    const doctorFindArgs = { email };

    try {
      const doctorExists = await this.DoctorRepositiory.findDoctor(
        doctorFindArgs
      );

      if (!doctorExists)
        throw new UnauthorizedError(
          "No account found associated with provided email"
        );

      const verificationCode = speakeasy.genVerificationCode();

      const attributes = { verfication_code: verificationCode };
      const condition = { email };

      await this.DoctorRepositiory.updateDoctor(attributes, condition);

      const mailOption: {
        to: string;
        subject: string;
        html: string;
      } = {
        to: email,
        subject: "Resetting your Eyadatak password",
        html: `Hello,<br> Your reset password.<br>Verfication code is: ${verificationCode}`,
      };

      sendEmail(mailOption);
    } catch (error: any) {
      logger.error("DoctorAuthService: forgetPassword:", error.message);
      throw error;
    }
  }

  /**
   * Doctor verify reset password auth service
   */
  async verifyResetPassword(verfication_code: string) {
    const findArg = { verfication_code };

    try {
      const doctor = await this.DoctorRepositiory.findDoctor(findArg);
      if (!doctor) throw new UnauthorizedError("Invalid code!");

      if (doctor!.verfication_code !== verfication_code)
        throw new UnauthorizedError("Invalid code!");

      const attributes = { verfication_code: "" };

      await this.DoctorRepositiory.updateDoctor(attributes, findArg);

      return doctor.email;
    } catch (error: any) {
      logger.error("DoctorAuthService: verifyResetPassword:", error.message);
      throw error;
    }
  }

  /**
   * Doctor reset password auth service
   */
  async resetPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      password = await passwordUtils.encodePassword(password);

      const attributes = { password };
      const findArgs = { email };

      const doctor = await this.DoctorRepositiory.findDoctor(findArgs);

      console.log(findArgs);
      console.log(doctor);

      if (!doctor)
        throw new UnauthorizedError(
          "No account found associated with provided email"
        );

      const updatedDoctor = await this.DoctorRepositiory.updateDoctor(
        attributes,
        findArgs
      );

      return { ...updatedDoctor };
    } catch (error: any) {
      logger.error("DoctorAuthService: resetPassword:", error.message);
      throw error;
    }
  }

  /**
   * Doctor verify code after register auth service
   */
  async verfiyRegister({ email, code }: { email: string; code: string }) {
    const findArg = { email };

    // try {
    //   const user = await this.DoctorRepositiory.findDoctor(findArg);
    //   if (!user) throw new UnauthorizedError("Email doesn't Exist!");

    //   if (user.verfication_code !== code) {
    //     throw new UnauthorizedError('Invalid verfication code');
    //   }

    //   const attributes = { is_verified: true, verfication_code: '' };
    //   const condition = { email };

    //   await this.DoctorRepositiory.updateUser(attributes, condition);

    //   const updatedUser = await this.DoctorRepositiory.findDoctor(condition);
    //   if (!updatedUser) throw new UnauthorizedError("User doesn't Exist!");

    //   const userId = updatedUser.id as string;

    //   const wallet = await this.WalletRepositiory.findByUserId(userId);

    //   delete updatedUser.password;

    //   return { ...updatedUser, wallet };
    // } catch (error: any) {
    //   logger.error('AuthService: verify:', error.message);
    //   throw error;
    // }

    return;
  }

  /**
   * Doctor getTokens auth service
   */
  async getTokens({
    id,
    role,
  }: {
    id: string;
    role: string;
  }): Promise<tokenPair> {
    const accessToken = jwtUtils.generateAccessToken(id, role);
    const refreshToken = jwtUtils.generateRefreshToken(id);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  /**
   * Doctor authenticate auth service
   */
  async authenticate() {
    return {};
  }

    /**
   * 
   * user doctor logout
   */
     async logout(){
      try {
        // await this.FcmTokenRepository.delete(fcmTokenFindArgs);
        return {};
      } catch (error: any) {
        logger.error("UserAuthService: Logout:", error.message);
        throw error;
      }
    }
}

export default AuthService;
