import { TimeAtModel } from "./TimeAtModel";

export interface PlanTaskModel {
  id: string;
  targetId: string;
  content: string;

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
