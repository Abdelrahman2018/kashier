import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import * as Sentry from "@sentry/node";
import { initSentry } from "../lib";
import api from "../api/routes";
import {
  notFoundErrorHandlerMiddleware,
  baseErrorHandlerMiddleware,
} from "../api/middlewares";
import multer from "multer";

type Props = { app: Application };
const expressLoader = async ({ app }: Props) => {
  //#region Middlewares
  app.use(cors());
  app.use(express.json({ limit: "50mb", strict: false }));
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(compression());
  // for parsing multipart/form-data
  // Sentry : Application monitoring middlewares
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  // multer to add image to request
  app.use(multer().any());
  //#endregion

  app.use("/api/v1", api);

  app.use(notFoundErrorHandlerMiddleware);
  app.use(baseErrorHandlerMiddleware);

  // Monitoring tool @sentry
  if (process.env.ENV !== "development") initSentry(app);

  //#region error handlers middlewares
  app.use(Sentry.Handlers.errorHandler());
  // app.use(ErrorHandler); TODO: our own error handler
  //#endregion
};

export default expressLoader;
