import { TimeAtModel } from "./TimeAtModel";

export interface ReportTaskModel {
  id: string;
  planTaskId: string;
  content: string;

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
