import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { CollectionService } from "../../services";
import { logger } from "../../lib";
import { CollectionAttributes } from "../../types/models";

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const collectionServInstance = Container.get(CollectionService);
  const limit = +req.body.limit || 10;
  const offset = +req.body.offset || 0;

  try {
    const collections = await collectionServInstance.getAll({
      limit,
      offset,
    });

    return res.status(200).json({
      ...collections,
      success: true,
      messages: "Collections fetched successfully",
    });
  } catch (error: any) {
    logger.error("CollectionController: findAll:", error.message);
    next(error);
  }
};

export const getCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const findArgs = { id: req.params.id };
  const collectionServInstance = Container.get(CollectionService);

  try {
    const collection = await collectionServInstance.getOne(findArgs);

    return res.status(200).json({
      collection,
      success: true,
      messages: "Collection fetched successfully",
    });
  } catch (error: any) {
    logger.error("CollectionController: getCollection:", error.message);
    next(error);
  }
};

export const createCollection= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const collectionServInstance = Container.get(CollectionService);

  try {
    req.body.groupId = req.headers.groupId as string;
    const collection = await collectionServInstance.create(req.body);

    return res.status(201).json({
      collection,
      success: true,
      message: "Collection created successfully!",
    });
  } catch (error: any) {
    logger.error("CollectionController: createCollection:", error.message);
    next(error);
  }
};


//#region Update Collection Controller
export const updateCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const collectionServInstance = Container.get(CollectionService);
  const attributes = req.body;
  const findArgs: CollectionAttributes = { id: req.params.id };
  try {
    const ccollection = await collectionServInstance.update(
      attributes,
      findArgs
    );

    return res.status(200).json({
      success: true,
      ccollection,
      message: "Collection updated successfully!",
    });
  } catch (error: any) {
    logger.error("CollectionController : updateCollection", error.message);
    next(error);
  }
}
//#endregion

//#region Delete Collection Controller
export const deleteCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const collectionServInstance = Container.get(CollectionService);
  const collectionId: string = req.params.id ;
  try {
    await collectionServInstance.delete(collectionId);

    return res.status(200).json({
      success: true,
      message: "Cllection deleted successfully!",
    });
  } catch (error: any) {
    logger.error("CollectionController : deleteCllection", error.message);
    next(error);
  }
}
//#endregion

