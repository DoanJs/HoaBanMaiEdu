import { TimeAtModel } from "./TimeAtModel";

export interface ChildrenModel {
  id: string;
  fullName: string;
  shortName: string;
  avatar: string;
  birth: TimeAtModel
  gender: string
  teacherIds: [string]
  parentIds:[string]

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
