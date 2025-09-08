import { TimeAtModel } from "./TimeAtModel";

export interface UserModel {
  id: string;
  email: string;
  phone: string;
  name: string;
  url: string;

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
