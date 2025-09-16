import { TimeAtModel } from "./TimeAtModel";

export interface ReportTaskModel {
  id: string;
  planId: string //xem co can dung khong
  planTaskId: string;
  content: string;
  reportId: string
  childId: string
  isEdit: boolean

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
