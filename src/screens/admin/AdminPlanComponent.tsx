import { Edit2 } from "iconsax-react";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { ChildrenModel, PlanModel } from "../../models";
import { handleChildFromId } from "../../constants/handleChildFromId";

interface Props {
  plan: PlanModel;
  children: ChildrenModel[];
  setPlantEdit: any;
}

export default function AdminPlanComponent(props: Props) {
  const { plan, children, setPlantEdit } = props;

  

  return (
    <tr>
      <td>{handleChildFromId(plan.childId, children)}</td>
      <td>{plan.title}</td>
      <td>{plan.status}</td>
      <td style={{ textAlign: "center" }}>
        <Edit2
          size={widthSmall ? sizes.bigText : sizes.title}
          color="coral"
          variant="Bold"
          style={{ cursor: "pointer" }}
          onClick={() => setPlantEdit(plan)}
        />
      </td>
    </tr>
  );
}
