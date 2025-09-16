import { PlanTaskModel } from "../models/PlanTaskModel";
import useFieldStore from "../zustand/useFieldStore";
import useTargetStore from "../zustand/useTargetStore";

interface Props {
  planTask: PlanTaskModel;
}

export default function PlanItemComponent(props: Props) {
  const { planTask } = props;
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();

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
      <td style={{width:'40%'}}>{planTask?.content}</td>
    </tr>
  );
}
