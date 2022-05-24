import { BuilderReturn } from "../types/general";

export const serviceErrorBuilder = (
  keys: string[] | string,
  statusCode: number = 500
): BuilderReturn<null> => {
  if (typeof keys === "string") {
    return {
      data: null,
      isError: true,
      errors: [
        {
          messageKey: keys,
        },
      ],
      statusCode,
    };
  } else {
    return {
      data: null,
      isError: true,
      errors: [...keys.map((key) => ({ messageKey: key }))],
      statusCode,
    };
  }
};
