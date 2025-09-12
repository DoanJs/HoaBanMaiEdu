import { where } from "firebase/firestore";
import { DocumentDownload, SaveAdd, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ModalDeleteComponent, RowComponent, SpaceComponent, TextComponent } from ".";
import { colors } from "../constants/colors";
import { getDocsData } from "../constants/firebase/getDocsData";
import { PlanTaskModel } from "../models/PlanTaskModel";
import PlanItemComponent from "./PlanItemComponent";

export default function PlanListComponent() {
  const location = useLocation();
  const { title, planId } = location.state || {};
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);

  useEffect(() => {
    if (planId) {
      getDocsData({
        nameCollect: 'planTasks',
        condition: [where('planId', '==', planId)],
        setData: setPlanTasks
      })
    }
  }, [planId])


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

      <div style={{ maxHeight: '85%', overflowY: 'scroll' }}>
        <table className="table">
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Mục tiêu</th>
              <th scope="col">Mức độ hỗ trợ</th>
              <th scope="col">Nội dung</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: 'justify' }}>
            {
              planTasks.length > 0 && planTasks.map((_, index) =>
                <PlanItemComponent planTask={_} key={index} />
              )
            }
          </tbody>
        </table>
      </div>

      <RowComponent justify="flex-end">
        <button
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
          <SaveAdd size={20} color={colors.bacground} />
          <SpaceComponent width={6} />
          <TextComponent text="Lưu" color={colors.bacground} />
        </button>
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

        <SpaceComponent width={10} />

        <button
          type="button"
          className="btn btn-primary"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DocumentDownload size={20} color={colors.bacground} />
          <SpaceComponent width={6} />
          <TextComponent text="Xuất File" color={colors.bacground} />
        </button>
      </RowComponent>

      <ModalDeleteComponent />
    </div>
  );
}
