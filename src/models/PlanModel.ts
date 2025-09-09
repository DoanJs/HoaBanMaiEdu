import { TimeAtModel } from "./TimeAtModel";

export interface PlanModel {
  id: string;
  title: string
  childId: string
  teacherId: string

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
