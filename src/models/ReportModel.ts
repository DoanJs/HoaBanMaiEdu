import { FieldValue } from "firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface ReportModel {
  id: string;
  type:string
  title: string;
  childId: string
  teacherIds: string[]
  authorId: string
  planId: string
  status: string
  comment: string
  
  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
