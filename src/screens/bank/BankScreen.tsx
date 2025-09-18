import { where } from "firebase/firestore";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import {
  FieldItemComponent,
  RowComponent,
  SpinnerComponent,
} from "../../components";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import { PlanTaskModel } from "../../models";
import { useFieldStore, usePlanTaskStore, useUserStore } from "../../zustand";

export default function BankScreen() {
  const { id } = useParams();
  const { user } = useUserStore();
  const { fields } = useFieldStore();
  const { setPlanTasks } = usePlanTaskStore();
  const { data: data_planTasks, loading: loading_planTasks } =
    useFirestoreWithMetaCondition({
      key: "planTasksCache",
      metaDoc: "planTasks",
      id: user?.id,
      nameCollect: "planTasks",
      condition: [
        where("teacherIds", "array-contains", user?.id),
        where("childId", "==", id),
      ],
    });

  useEffect(() => {
    if (data_planTasks) {
      setPlanTasks(data_planTasks as PlanTaskModel[]);
    }
  }, [data_planTasks]);

  if (!fields && loading_planTasks) return <SpinnerComponent />;
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
