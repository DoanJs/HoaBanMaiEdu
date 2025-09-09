import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { updateMetaOnChange } from "./updateMetaOnChange";

/**
 * Add document vào collection + update Meta
 */
export async function addWithMeta(collectionId: string, data: any) {
  const ref = collection(db, collectionId);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updateAt: serverTimestamp(),
  });

  await updateMetaOnChange(collectionId);

  return docRef.id;
}

/**
 * Update document trong collection + update Meta
 */
export async function updateWithMeta(
  collectionId: string,
  docId: string,
  data: any
) {
  const ref = doc(db, collectionId, docId);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });

  await updateMetaOnChange(collectionId);
}

/**
 * Delete document + update Meta
 */
export async function deleteWithMeta(collectionId: string, docId: string) {
  const ref = doc(db, collectionId, docId);
  await deleteDoc(ref);

  await updateMetaOnChange(collectionId);
}

/**
 * Set document với ID custom + update Meta
 */
export async function setWithMeta(
  collectionId: string,
  docId: string,
  data: any
) {
  const ref = doc(db, collectionId, docId);
  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });

  await updateMetaOnChange(collectionId);
}
