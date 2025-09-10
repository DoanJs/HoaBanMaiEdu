import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  FieldItemComponent,
  RowComponent,
  SpinnerComponent,
} from "../../components";
import {
  query_fields,
  query_targets,
} from "../../constants/firebase/query/Index";
import { useFirestoreWithMeta } from "../../constants/useFirestoreWithMeta";
import { FieldModel } from "../../models/FieldModel";
import { TargetModel } from "../../models/TargetModel";
import useFieldStore from "../../zustand/useFieldStore";
import useTargetStore from "../../zustand/useTargetStore";

export default function BankScreen() {
  const { fields, setFields } = useFieldStore();
  const { setTargets } = useTargetStore();

  const { data: data_fields, loading } = useFirestoreWithMeta(
    "fieldsCache",
    query_fields,
    "fields"
  );
  const { data: data_targets, loading: loading_targets } = useFirestoreWithMeta(
    "targetsCache",
    query_targets,
    "targets"
  );

  useEffect(() => {
    if (!loading_targets) {
      setTargets(data_targets as TargetModel[]);
    }
  }, [data_targets, loading_targets]);

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
