import { serverTimestamp } from "firebase/firestore";
import { colors } from "../constants/colors";
import { addDocData } from "../constants/firebase/addDocData";
import { TargetModel } from "../models/TargetModel";
import { useChildStore, usePlanTaskStore, useUserStore } from "../zustand";
import useCartStore from "../zustand/useCartStore";
import { deleteDocData } from "../constants/firebase/deleteDocData";

interface Props {
  index: number;
  target: TargetModel;
}

export default function TargetItemComponent(props: Props) {
  const { index, target } = props;
  const { carts, removeCart, addCart } = useCartStore();
  const { planTasks } = usePlanTaskStore();
  const { child } = useChildStore()
  const { user } = useUserStore()

  const showSelected = () => {
    let status: boolean = false;
    const index = carts.findIndex((cart) => cart.targetId === target.id);
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
    if (user && child) {
      const index = carts.findIndex((cart) => cart.targetId === target.id);
      if (index !== -1) {
        removeCart(carts[index].id);
        deleteDocData({
          nameCollect: 'carts',
          id: carts[index].id,
          metaDoc: 'carts'
        })
      } else {
        addDocData({
          nameCollect: 'carts',
          value: {
            targetId: target.id,
            level: target.level,
            name: target.name,
            fieldId: target.fieldId,

            content: "",
            intervention: "",
            childId: child.id,
            teacherIds: child.teacherIds,
            author: user.id,

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          },
          metaDoc: 'carts'
        }).then((result) => addCart({
          ...target,
          id: result.id,
          targetId: target.id,
          content: "",
          intervention: "",
          childId: child.id,
          teacherIds: child.teacherIds,
          author: user.id,

          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        }))
      }
    }
  };

  return (
    <tr style={{ color: isSelectedTarget() ? 'coral' : colors.textBold }}>
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
