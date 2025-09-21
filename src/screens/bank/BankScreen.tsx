import { where } from "firebase/firestore";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import {
  FieldItemComponent,
  RowComponent,
  SpinnerComponent,
} from "../../components";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { useFieldStore, usePlanTaskStore, useUserStore } from "../../zustand";

export default function BankScreen() {
  const { id } = useParams();
  const { user } = useUserStore();
  const { fields } = useFieldStore();
  const { setPlanTasks } = usePlanTaskStore();
  useEffect(() => {
    if (id) {
      getDocsData({
        nameCollect: 'planTasks',
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("childId", "==", id),],
        setData: setPlanTasks
      })
    }
  }, [id]);

  if (!fields ) return <SpinnerComponent />;
  return (
    <RowComponent
      styles={{
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {fields.map((_, index) => (
          <FieldItemComponent key={index} title={_.name} fieldId={_.id} />
        ))}
      </div>

      <Outlet />
    </RowComponent>
  );
}
