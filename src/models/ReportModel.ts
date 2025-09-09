import { TimeAtModel } from "./TimeAtModel";

export interface ReportModel {
  id: string;
  title: string;
  childId: string
  teacherId: string

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
