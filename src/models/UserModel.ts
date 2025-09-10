import { TimeAtModel } from "./TimeAtModel";

export interface UserModel {
  id: string;
  fullName: string;
  shortName: string
  email: string;
  phone: string;
  avatar: string;
  birth: string
  role: string
  position: string

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
