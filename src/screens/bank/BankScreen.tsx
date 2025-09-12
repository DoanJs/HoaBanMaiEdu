import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  FieldItemComponent,
  RowComponent,
  SpinnerComponent,
} from "../../components";
import {
  query_fields
} from "../../constants/firebase/query/Index";
import { useFirestoreWithMeta } from "../../constants/useFirestoreWithMeta";
import { FieldModel } from "../../models/FieldModel";
import useFieldStore from "../../zustand/useFieldStore";

export default function BankScreen() {
  const { fields, setFields } = useFieldStore();
  const { data: data_fields, loading } = useFirestoreWithMeta({
    key: "fieldsCache",
    query: query_fields,
    metaDoc: "fields",
  });


  useEffect(() => {
    if (!loading) {
      setFields(data_fields as FieldModel[]);
    }
  }, [data_fields, loading]);

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
          <FieldItemComponent key={index} title={_.name} fieldId={_.id} />
        ))}
      </div>

      <Outlet />
    </RowComponent>
  );
}
