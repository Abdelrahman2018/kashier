import dotenv from "dotenv";
import sequelizeConfig from "./sequelize-config.json";

type EnvTypes = "development" | "test" | "production";

const envFound = dotenv.config();

if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

export default {
  PORT: parseInt(process.env.PORT as string, 10) || 5000,
  SEQUELIZE_CONFIG: sequelizeConfig[process.env.NODE_ENV as EnvTypes],
  SALT_FACTOR: parseInt(process.env.SALT_FACTOR as string) || 10,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "",
  MAIL_FROM: '"Stuck" <info@stuckapp.com>',
  MAIL_PORT: 587,
  MAIL_HOST: "smtp.mailgun.org",
  MAILER_USER: process.env.MAILER_USER ?? "",
  MAILER_PASS: process.env.MAILER_PASS ?? "",
};
