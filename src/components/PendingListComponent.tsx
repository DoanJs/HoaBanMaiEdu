import { where } from "firebase/firestore";
import { AddCircle, Edit2, SaveAdd, Trash } from "iconsax-react";
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
import { convertTargetField } from "../constants/convertTargetAndField";
import { getDocsData } from "../constants/firebase/getDocsData";
import { updateDocData } from "../constants/firebase/updateDocData";
import { sizes } from "../constants/sizes";
import { PlanTaskModel } from "../models";
import {
  useCartEditStore,
  useCartStore,
  useFieldStore,
  useSelectTargetStore,
  useTargetStore,
  useUserStore,
} from "../zustand";
import LoadingOverlay from "./LoadingOverLay";

export default function PendingListComponent() {
  const location = useLocation();
  const { fields } = useFieldStore()
  const { user } = useUserStore()
  const { title, planId, comment } = location.state || {};
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const { setSelectTarget } = useSelectTargetStore();
  const { setCarts } = useCartStore();
  const { setCartEdit } = useCartEditStore();
  const { targets } = useTargetStore();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (planId) {
      comment && setText(comment.split('@Js@')[1])
      getDocsData({
        nameCollect: "planTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("planId", "==", planId)],
        setData: setPlanTasks,
      });
    }
  }, [planId]);
  useEffect(() => {
    if (text !== comment.split('@Js@')[1]) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [text])

  const handleEditPlan = () => {
    const convertPlanTasksToCarts = planTasks.map((_) => {
      const { targetId, planId, ...newPlanTask } = _;
      return {
        ...newPlanTask,
        fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        id: _.targetId, //targetId
        name: convertTargetField(_.targetId, targets, fields).nameTarget,
      };
    });
    setCarts(convertPlanTasksToCarts);
    setCartEdit(planId);
    setSelectTarget("GIỎ MỤC TIÊU");
  };
  const handleSaveComment = async () => {
    setIsLoading(true)
    await updateDocData({
      nameCollect: 'plans',
      id: planId,
      metaDoc: 'plans',
      valueUpdate: { comment: text ? `${user?.fullName}@Js@${text}` : '' }
    })
    setIsLoading(false)
    setDisable(true)
  }

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
        <table className="table table-bordered">
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
        {
          comment &&
          <>
            <TextComponent text={`Góp ý từ cô ${comment.split('@Js@')[0]}: `} size={sizes.bigText} styles={{ fontWeight: 'bold' }} />
            <SpaceComponent height={4} />
            <RowComponent>
              <textarea
                style={{

                  padding: 10,
                  textAlign: 'justify',
                  color: colors.red
                }}
                disabled={!['Phó Giám đốc', 'Giám đốc'].includes(user?.position as string)}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="form-control"
                placeholder="Nhập comment"
                rows={5}
              ></textarea>

            </RowComponent>
            <SpaceComponent height={10} />
          </>
        }
      </div>

      <SpaceComponent height={4} />

      <RowComponent justify='space-between'>
        {
          ['Phó Giám đốc', 'Giám đốc'].includes(user?.position as string) &&
          (
            comment ?
              <button
                onClick={disable ? undefined : handleSaveComment}
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                style={{
                  background: disable ? colors.gray : colors.primary,
                  borderColor: disable ? colors.gray : colors.primary,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SaveAdd size={20} color={colors.bacground} />
                <SpaceComponent width={6} />
                <TextComponent text="Lưu góp ý" color={colors.bacground} />
              </button>
              :
              <div
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AddCircle size={30} color={colors.primary} variant="Bold" />
                <SpaceComponent width={4} />
                <TextComponent text="Góp ý" size={sizes.bigText} />
              </div>
          )
        }
        <RowComponent justify="flex-end">
          <Link
            onClick={handleEditPlan}
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
      </RowComponent>

      <ModalDeleteComponent
        data={{ id: planId, nameCollect: "plans", itemTasks: planTasks }}
      />

      <LoadingOverlay show={isLoading} />
    </div>
  );
}
