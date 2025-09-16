import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

export async function updateMetaOnChange(collectionId: string) {
  const ref = doc(db, "Meta", collectionId);
  await setDoc(
    ref,
    {
      lastUpdated: serverTimestamp(),
    },
    { merge: true } // tránh overwrite field cũ
  );
}
