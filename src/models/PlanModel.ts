import { TimeAtModel } from "./TimeAtModel";

export interface PlanModel {
  id: string;
  title: string
  planTaskIds:[string]
  childId: string

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
