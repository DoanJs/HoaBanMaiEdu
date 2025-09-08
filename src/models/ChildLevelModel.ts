import { TimeAtModel } from "./TimeAtModel";

export interface ChildLevelModel {
  id: string;
  childId: string;
  levelI: [string]
  levelII: [string]
  levelIII: [string]
  levelIV: [string]

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
