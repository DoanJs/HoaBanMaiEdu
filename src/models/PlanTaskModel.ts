import { TimeAtModel } from "./TimeAtModel";

export interface PlanTaskModel {
  id: string;
  targetId: string;
  planId: string
  content: string;
  intervention: string

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
