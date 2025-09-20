import { where } from "firebase/firestore";
import { DocumentDownload } from "iconsax-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  PlanItemComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from ".";
import { colors } from "../constants/colors";
import { convertTargetField } from "../constants/convertTargetAndField";
import { getDocsData } from "../constants/firebase/getDocsData";
import { widthSmall } from "../constants/reponsive";
import { sizes } from "../constants/sizes";
import { exportWord } from "../exportFile/WordExport";
import { PlanTaskModel } from "../models";
import {
  useChildStore,
  useFieldStore,
  useTargetStore,
  useUserStore,
} from "../zustand";

export default function PlanListComponent() {
  const location = useLocation();
  const { title, planId } = location.state || {};
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (planId) {
      getDocsData({
        nameCollect: "planTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("planId", "==", planId),
        ],
        setData: setPlanTasks,
      });
    }
    // eslint-disable-next-line
  }, [planId]);

  const handleExportWordKH = () => {
    const items = planTasks.map((planTask) => {
      return {
        field: convertTargetField(planTask.targetId, targets, fields).nameField,
        target: convertTargetField(planTask.targetId, targets, fields)
          .nameTarget,
        intervention: planTask.intervention,
        content: planTask.content,
      };
    });

    exportWord(
      {
        rows: items,
        title: title.substring(2).trim(),
        child: child?.fullName,
        teacher: user?.fullName,
      },
      "/template_KH.docx"
    );
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
        <TextComponent
          text={`${title}`}
          size={widthSmall ? sizes.thinTitle : sizes.bigTitle}
          styles={{ fontWeight: "bold" }}
        />
      </RowComponent>

      <div style={{ height: widthSmall ? "80%" : "85%", overflowY: "scroll" }}>
        <table
          className="table table-bordered"
          style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
        >
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
                <PlanItemComponent key={index} planTask={_} />
              ))}
          </tbody>
        </table>
      </div>

      <RowComponent justify="flex-end">
        <button
          onClick={handleExportWordKH}
          type="button"
          className="btn btn-primary"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DocumentDownload
            size={widthSmall ? sizes.bigText : sizes.smallTitle}
            color={colors.bacground}
          />
          <SpaceComponent width={6} />
          <TextComponent
            text="Xuất File"
            size={widthSmall ? sizes.text : sizes.bigText}
            color={colors.bacground}
          />
        </button>
      </RowComponent>
    </div>
  );
}
