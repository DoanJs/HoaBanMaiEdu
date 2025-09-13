import { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import { PlanTaskModel } from "../models/PlanTaskModel";
import useFieldStore from "../zustand/useFieldStore";
import useTargetStore from "../zustand/useTargetStore";

interface Props {
  planTask: PlanTaskModel;
  setDisable: any;
  planTasks: PlanTaskModel[];
  onSetPlanTasks: any;
}

export default function PlanItemComponent(props: Props) {
  const { planTask, onSetPlanTasks, planTasks, setDisable } = props;
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const [contentSource, setContentSource] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (planTask) {
      setContent(planTask.content);
      setContentSource(planTask.content);
    }
  }, [planTask]);

  useEffect(() => {
    const index = planTasks.findIndex((_) => _.id === planTask.id);
    if (content && content !== contentSource) {
      planTasks[index].content = content;
      planTasks[index].isEdit = true;
      onSetPlanTasks(planTasks);
    } else {
      planTasks[index].isEdit = false;
    }

    const isEdit = planTasks.some((plan) => plan.isEdit);
    setDisable(!isEdit);
  }, [content]);

  const showTarget = () => {
    let field: string = "";
    let name: string = "";
    const index = targets.findIndex(
      (target) => target.id === planTask.targetId
    );
    if (index !== -1) {
      const indexField = fields.findIndex(
        (_) => _.id === targets[index].fieldId
      );
      field = fields[indexField].name;
      name = targets[index].name;
    }

    return { name, field };
  };

  return (
    <tr>
      <th scope="row">{showTarget().field}</th>
      <td>{showTarget().name}</td>
      <td>{planTask?.intervention}</td>
      <td>
        <textarea
          onChange={(e) => setContent(e.target.value)}
          className="form-control"
          placeholder="Nhập đánh giá"
          rows={6}
          cols={150}
          style={{ borderColor: colors.primary }}
          id="floatingTextarea2"
          value={content}
        ></textarea>
      </td>
    </tr>
  );
}
