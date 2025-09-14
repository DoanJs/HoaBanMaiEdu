import { FieldValue } from "firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface ReportModel {
  id: string;
  title: string;
  childId: string
  teacherId: string
  planId: string

  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
