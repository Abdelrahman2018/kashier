import { BuilderReturn } from "../types/general";

export const serviceDataBuilder = (
  data: any,
  statusCode: number = 200
): BuilderReturn<any> => {
  return {
    isError: false,
    errors: [],
    data,
    statusCode,
  };
};
