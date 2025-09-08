import { TimeAtModel } from "./TimeAtModel";

export interface ChildrenModel {
  id: string;
  name: string;
  shortName: string;
  url: string;
  teacherIds: [string]

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
