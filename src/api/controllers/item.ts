import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { ItemService } from "../../services";
import { logger } from "../../lib";
import { ItemAttributes } from "../../types/models";

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const itemServInstance = Container.get(ItemService);
  const limit = +req.body.limit || 10;
  const offset = +req.body.offset || 0;

  try {
    const items = await itemServInstance.getAll({
      limit,
      offset,
    });

    return res.status(200).json({
      ...items,
      success: true,
      messages: "items fetched successfully",
    });
  } catch (error: any) {
    logger.error("ItemController: findAll:", error.message);
    next(error);
  }
};

export const getItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const findArgs = { id: req.params.id };
  const itemServInstance = Container.get(ItemService);

  try {
    const item = await itemServInstance.getOne(findArgs);

    return res.status(200).json({
      item,
      success: true,
      messages: "item fetched successfully",
    });
  } catch (error: any) {
    logger.error("ItemController: getItem:", error.message);
    next(error);
  }
};

export const createItem= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const itemServInstance = Container.get(ItemService);

  try {
    const item = await itemServInstance.create(req.body);

    return res.status(201).json({
      item,
      success: true,
      message: "item created successfully!",
    });
  } catch (error: any) {
    logger.error("ItemController: createItem:", error.message);
    next(error);
  }
};


//#region Update Item Controller
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const itemServInstance = Container.get(ItemService);
  const attributes = req.body;
  const findArgs: ItemAttributes = { id: req.params.id };
  try {
    const item = await itemServInstance.update(
      attributes,
      findArgs
    );

    return res.status(200).json({
      success: true,
      item,
      message: "Item updated successfully!",
    });
  } catch (error: any) {
    logger.error("ItemController : updateItem", error.message);
    next(error);
  }
}
//#endregion

//#region Delete Item Controller
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const itemServInstance = Container.get(ItemService);
  const itemId: string = req.params.id ;
  try {
    await itemServInstance.delete(itemId);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully!",
    });
  } catch (error: any) {
    logger.error("ItemController : deleteItem", error.message);
    next(error);
  }
}
//#endregion

