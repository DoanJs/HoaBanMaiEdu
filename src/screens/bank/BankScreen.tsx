import { Outlet } from "react-router-dom";
import {
  FieldItemComponent,
  RowComponent,
  SpinnerComponent,
} from "../../components";
import useFieldStore from "../../zustand/useFieldStore";

export default function BankScreen() {
  const { fields } = useFieldStore();

  if (!fields) return <SpinnerComponent />;
  return (
    <RowComponent
      styles={{
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent:'center' }}>
        {fields.map((_, index) => (
          <FieldItemComponent key={index} title={_.name} fieldId={_.id} />
        ))}
      </div>

      <Outlet />
    </RowComponent>
  );
}
