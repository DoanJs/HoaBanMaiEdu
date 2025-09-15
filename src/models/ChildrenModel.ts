import { TimeAtModel } from "./TimeAtModel";

export interface ChildrenModel {
  id: string;
  fullName: string;
  avatar: string;
  birth: TimeAtModel
  gender: string
  teacherIds: [string]
  managerIds: [string]
  // parentIds:[string]

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
