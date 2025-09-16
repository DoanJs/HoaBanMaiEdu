import { FieldValue } from "firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface PlanTaskModel {
  id: string;
  targetId: string;
  planId: string
  childId: string
  content: string;
  intervention: string

  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
