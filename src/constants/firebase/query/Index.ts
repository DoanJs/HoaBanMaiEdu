import { collection, query, where } from "firebase/firestore";
import { db } from "../../../firebase.config";

export const query_fields = query(collection(db, "fields"));
export const query_targets = query(collection(db, "targets"));
export const query_children = (id: string) =>
  query(collection(db, "children"), where("teacherIds", "array-contains", id));
