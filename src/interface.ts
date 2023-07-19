export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: null | number;
  tags: string[];
}

export interface IParams {
  page: number;
  pageSize: number;
}

export interface DataType {
  key: string;
  name: string;
  email: string;
  phone: number;
  tags: string[];
  id: string;
}
