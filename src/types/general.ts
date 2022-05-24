
export enum UserRole {
  regular = "regular",
  manager = "manager",
  globalManager = "globalManager",
}

export interface IObjectKeys {
  [key: string]: any;
}


export interface BuilderReturn<DataType> {
  data: DataType;
  isError: boolean;
  errors: {
    messageKey: string;
  }[];
  statusCode: number;
}

export interface Pagination {
  page: number;
  size: number;
}

export interface tokenPair {
  accessToken: string;
  refreshToken: string;
}

export const userRoles = ["regular", "manager"];