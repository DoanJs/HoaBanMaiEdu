import { FieldValue } from "firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface PlanTaskModel {
  id: string;
  targetId: string;
  planId: string
  content: string;
  intervention: string
  isEdit: boolean //xong roi bo luon

  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
