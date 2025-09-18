import { colors } from "../constants/colors";
import { TargetModel } from "../models/TargetModel";
import { usePlanTaskStore } from "../zustand";
import useCartStore from "../zustand/useCartStore";

interface Props {
  index: number;
  target: TargetModel;
}

export default function TargetItemComponent(props: Props) {
  const { index, target } = props;
  const { carts, removeCart, addCart } = useCartStore();
  const { planTasks } = usePlanTaskStore();

  const showSelected = () => {
    let status: boolean = false;
    const index = carts.findIndex((cart) => cart.id === target.id);
    if (index === -1) {
      status = false;
    } else {
      status = true;
    }

    return status;
  };
  const isSelectedTarget = () => {
    let isSelected: boolean = false;
    const index = planTasks.findIndex(
      (planTask) => planTask.targetId === target.id
    );
    if (index !== -1) {
      isSelected = true;
    } else {
      isSelected = false;
    }

    return isSelected;
  };
  const handleSelected = () => {
    const index = carts.findIndex((cart) => cart.id === target.id);
    if (index !== -1) {
      removeCart(target.id);
    } else {
      addCart(target);
    }
  };
  return (
    <tr style={{ color: isSelectedTarget() ? 'coral': colors.textBold }}>
      <td style={{ textAlign: "center" }}>{index + 1}</td>
      <td>
        <label className="form-check-label" htmlFor={`targetItem${target.id}`}>
          {target.name}
        </label>
      </td>
      <td style={{ textAlign: "center" }}>{target.level}</td>
      <td>
        <div
          className="form-check"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            checked={showSelected()}
            onChange={handleSelected}
            className="form-check-input"
            type="checkbox"
            value=""
            id={`targetItem${target.id}`}
          />
        </div>
      </td>
    </tr>
  );
}
