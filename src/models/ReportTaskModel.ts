import { TimeAtModel } from "./TimeAtModel";

export interface ReportTaskModel {
  id: string;
  planTaskId: string;
  content: string;
  reportId: string
  isEdit: boolean

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
