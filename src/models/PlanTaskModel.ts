import { FieldValue } from "firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface PlanTaskModel {
  id: string;
  targetId: string;
  planId: string
  content: string;
  intervention: string
  isEdit: boolean

  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
