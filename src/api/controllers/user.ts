import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services";
import { logger } from "../../lib";
import { UserAttributes } from "../../types/models";

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userServInstance = Container.get(UserService);
  const limit = +req.body.limit || 10;
  const offset = +req.body.offset || 0;

  try {
    const doctors = await userServInstance.getAll({
      limit,
      offset,
    });

    return res.status(200).json({
      ...doctors,
      success: true,
      messages: "Users fetched successfully",
    });
  } catch (error: any) {
    logger.error("UserController: findAll:", error.message);
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const findArgs = { id: req.params.id };
  const userServInstance = Container.get(UserService);

  try {
    const user = await userServInstance.getOne(findArgs);

    return res.status(200).json({
      user,
      success: true,
      messages: "User fetched successfully",
    });
  } catch (error: any) {
    logger.error("UserController: getUser:", error.message);
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userServInstance = Container.get(UserService);

  try {
    const user = await userServInstance.create(req.body);

    return res.status(201).json({
      user,
      success: true,
      message: "User created successfully!",
    });
  } catch (error: any) {
    logger.error("UserController: createUser:", error.message);
    next(error);
  }
};


//#region Update User Controller
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userService = Container.get(UserService);
  const attributes = req.body;
  const findArgs: UserAttributes = { id: req.params.id };
  try {
    const user = await userService.update(
      attributes,
      findArgs
    );

    return res.status(200).json({
      success: true,
      user,
      message: "User updated successfully!",
    });
  } catch (error: any) {
    logger.error("UserController : updateUser", error.message);
    next(error);
  }
}
//#endregion

//#region Delete Doctor Controller
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userService = Container.get(UserService);
  const userId: string = req.params.id ;
  try {
    await userService.deleteUser(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error: any) {
    logger.error("UserController : deleteUser", error.message);
    next(error);
  }
}
//#endregion

