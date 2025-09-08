import { TimeAtModel } from "./TimeAtModel";

export interface ReportModel {
  id: string;
  title: string;
  reportTaskIds: [string];
  childId: string

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
