import { collection, getDocs, query } from "firebase/firestore";
import { SetStateAction } from "react";
import { db } from "../../firebase.config";

export const getDocsData = async ({
  nameCollect,
  condition,
  setData,
}: {
  nameCollect: string;
  setData: SetStateAction<any>;
  condition?: any;
}) => {
  try {
    const q = condition
      ? query(collection(db, nameCollect), ...condition)
      : query(collection(db, nameCollect));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(items); // In ra danh sách item
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
};
