import { where } from "firebase/firestore";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ModalDeleteComponent,
  PendingItemComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from ".";
import { colors } from "../constants/colors";
import { getDocsData } from "../constants/firebase/getDocsData";
import { PlanTaskModel } from "../models/PlanTaskModel";
import useCartEditStore from "../zustand/useCartEditStore";
import useCartStore from "../zustand/useCartStore";
import useSelectTargetStore from "../zustand/useSelectTargetStore";
import useTargetStore from "../zustand/useTargetStore";

export default function PendingListComponent() {
  const location = useLocation();
  const { title, planId } = location.state || {};
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const { setSelectTarget } = useSelectTargetStore();
  const { setCarts } = useCartStore();
  const { setCartEdit } = useCartEditStore();
  const { targets } = useTargetStore();

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (planId) {
      getDocsData({
        nameCollect: "planTasks",
        condition: [where("planId", "==", planId)],
        setData: setPlanTasks,
      });
    }
  }, [planId]);

  const convertNameTargetAndFieldId = (targetId: string) => {
    let name: string = "";
    let fieldId: string = "";
    const index = targets.findIndex((target) => target.id === targetId);
    if (index !== -1) {
      name = targets[index].name;
      fieldId = targets[index].fieldId;
    }

    return { name, fieldId };
  };

  return (
    <div style={{ width: "100%" }}>
      <RowComponent
        justify="space-between"
        styles={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          width: "100%",
          padding: 10,
          borderBottom: "1px solid",
          borderBottomColor: colors.gray,
        }}
      >
        <TextComponent text={`${title}`} size={32} />
      </RowComponent>

      <div style={{ maxHeight: "85%", overflowY: "scroll" }}>
        <table className="table">
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Mục tiêu</th>
              <th scope="col">Mức độ hỗ trợ</th>
              <th scope="col">Nội dung</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "justify" }}>
            {planTasks.length > 0 &&
              planTasks.map((_, index) => (
                <PendingItemComponent key={index} planTask={_} />
              ))}
          </tbody>
        </table>
      </div>

      <RowComponent justify="flex-end">
        <Link
          onClick={() => {
            const convertPlanTasks = planTasks.map((_) => {
              const { targetId, planId, ...newPlanTask } = _;
              return {
                ...newPlanTask,
                fieldId: convertNameTargetAndFieldId(_.targetId).fieldId,
                id: _.targetId, //targetId
                name: convertNameTargetAndFieldId(_.targetId).name,
              };
            });
            setCarts(convertPlanTasks);
            setCartEdit(planId);
            setSelectTarget("GIỎ MỤC TIÊU");
          }}
          to={`../cart`}
          type="button"
          className="btn btn-success"
          data-bs-dismiss="modal"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Edit2 size={20} color={colors.bacground} />
          <SpaceComponent width={6} />
          <TextComponent text="Sửa" color={colors.bacground} />
        </Link>
        <SpaceComponent width={10} />
        <button
          type="button"
          className="btn btn-danger"
          data-bs-dismiss="modal"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Trash size={20} color={colors.bacground} />
          <SpaceComponent width={6} />
          <TextComponent text="Xóa" color={colors.bacground} />
        </button>
      </RowComponent>

      <ModalDeleteComponent
        data={{ id: planId, nameCollect: "plans", itemTasks: planTasks }}
      />
    </div>
  );
}
