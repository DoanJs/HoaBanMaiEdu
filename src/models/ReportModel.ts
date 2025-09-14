import { FieldValue } from "firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface ReportModel {
  id: string;
  type:string
  title: string;
  childId: string
  teacherId: string
  planId: string
  status: string
  
  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
