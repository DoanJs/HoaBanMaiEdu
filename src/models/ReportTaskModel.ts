import { TimeAtModel } from "./TimeAtModel";

export interface ReportTaskModel {
  id: string;
  planTaskId: string;
  content: string;
  reportId: string

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
