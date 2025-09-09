import { collection, query } from "firebase/firestore";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  FieldItemComponent,
  RowComponent,
  SpinnerComponent,
} from "../../components";
import { useFirestoreWithMeta } from "../../constants/useFirestoreWithMeta";
import { db } from "../../firebase.config";
import { FieldModel } from "../../models/FieldModel";
import useFieldStore from "../../zustand/useFieldStore";

export default function BankScreen() {
  const { fields, setFields } = useFieldStore();
  const q = query(collection(db, "fields"));
  const { data, loading } = useFirestoreWithMeta("fieldsCache", q, "fields");

  useEffect(() => {
    if (!loading) {
      setFields(data as FieldModel[]);
    }
  }, [data, loading]);

  if (loading) return <SpinnerComponent />;
  return (
    <RowComponent
      styles={{
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {fields.map((_, index) => (
          <FieldItemComponent key={index} title={_.name} />
        ))}
      </div>

      <Outlet />
    </RowComponent>
  );
}
