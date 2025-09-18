import { FieldValue } from "firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface PlanModel {
  id: string;
  type: string
  title: string
  childId: string
  teacherIds: string[]
  status: string
  comment: string

  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
