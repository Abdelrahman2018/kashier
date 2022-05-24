import { Messages } from "../localization";
import { HeaderLanguage } from "../types/general";
import { getFromNestedObjectByString } from "./nested-obj-selector";

export const getErrorMessagesByKeys = (errors: any[], lang: HeaderLanguage) => {
  return {
    errors: errors.map((e) => ({
      ...e,
      message: getFromNestedObjectByString(e.messageKey, Messages[lang]),
      messageKey: undefined,
    })),
  };
};
