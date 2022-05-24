import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { GroupService } from "../../services";
import { logger } from "../../lib";
import { GroupAttributes } from "../../types/models";

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const groupServInstance = Container.get(GroupService);
  const limit = +req.body.limit || 10;
  const offset = +req.body.offset || 0;

  try {
    const groups = await groupServInstance.getAll({
      limit,
      offset,
    });

    return res.status(200).json({
      ...groups,
      success: true,
      messages: "Groups fetched successfully",
    });
  } catch (error: any) {
    logger.error("GroupController: findAll:", error.message);
    next(error);
  }
};

export const getGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const findArgs = { id: req.params.id };
  const groupServInstance = Container.get(GroupService);

  try {
    const group = await groupServInstance.getOne(findArgs);

    return res.status(200).json({
      group,
      success: true,
      messages: "Group fetched successfully",
    });
  } catch (error: any) {
    logger.error("GroupController: getGroup:", error.message);
    next(error);
  }
};

export const createGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const groupServInstance = Container.get(GroupService);

  try {
    const group = await groupServInstance.create(req.body);

    return res.status(201).json({
      group,
      success: true,
      message: "Group created successfully!",
    });
  } catch (error: any) {
    logger.error("GroupController: createGroup:", error.message);
    next(error);
  }
};


//#region Update Group Controller
export const updateGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const groupServInstance = Container.get(GroupService);
  const attributes = req.body;
  const findArgs: GroupAttributes = { id: req.params.id };
  try {
    const group = await groupServInstance.update(
      attributes,
      findArgs
    );

    return res.status(200).json({
      success: true,
      group,
      message: "Group updated successfully!",
    });
  } catch (error: any) {
    logger.error("GroupController : updateGroup", error.message);
    next(error);
  }
}
//#endregion

//#region Delete Group Controller
export const deleteGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const groupServInstance = Container.get(GroupService);
  const groupId: string = req.params.id ;
  try {
    await groupServInstance.delete(groupId);

    return res.status(200).json({
      success: true,
      message: "Group deleted successfully!",
    });
  } catch (error: any) {
    logger.error("GroupController : deleteGroup", error.message);
    next(error);
  }
}
//#endregion

