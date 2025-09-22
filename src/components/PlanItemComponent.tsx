import { convertTargetField } from "../constants/convertTargetAndField";
import { PlanTaskModel } from "../models";
import { useFieldStore, useTargetStore } from "../zustand";

interface Props {
  planTask: PlanTaskModel;
}

export default function PlanItemComponent(props: Props) {
  const { planTask } = props;
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();

  return (
    <tr>
      <th scope="row">{convertTargetField(planTask.targetId, targets, fields).nameField}</th>
      <td>{convertTargetField(planTask.targetId, targets, fields).nameTarget}</td>
      <td>{planTask?.intervention}</td>
      <td style={{ width: '40%' }}>{planTask?.content}</td>
    </tr>
  );
}
