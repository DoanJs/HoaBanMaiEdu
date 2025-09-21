import { where } from "firebase/firestore";
import { AddCircle, ArchiveTick, Edit2, SaveAdd, Trash } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { groupArrayWithField } from "../constants/groupArrayWithField";
import { handleToastError, handleToastSuccess } from "../constants/handleToast";
import { widthSmall } from "../constants/reponsive";
import { sizes } from "../constants/sizes";
import { PlanTaskModel } from "../models";
import {
  useCartEditStore,
  useCartStore,
  useFieldStore,
  usePlanStore,
  useSelectTargetStore,
  useTargetStore,
  useUserStore,
} from "../zustand";
import LoadingOverlay from "./LoadingOverLay";

export default function PendingListComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fields } = useFieldStore();
  const { user } = useUserStore();
  const { title, planId, comment } = location.state || {};
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const { setSelectTarget } = useSelectTargetStore();
  const { plans, editPlan } = usePlanStore();
  const { setCarts } = useCartStore();
  const { setCartEdit } = useCartEditStore();
  const { targets } = useTargetStore();
  const [isComment, setIsComment] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const textareaPlanRef = useRef<any>(null);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (planId) {
      if (comment) {
        setIsComment(true);
        setText(comment.split("@Js@")[1]);
      }
      getDocsData({
        nameCollect: "planTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("planId", "==", planId),
        ],
        setData: setPlanTasks,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);
  useEffect(() => {
    if (text !== comment?.split("@Js@")[1]) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
if(isComment){
  textareaPlanRef.current.focus()
}
  },[isComment])
  const handleEditPlan = () => {
    const convertPlanTasksToCarts = planTasks.map((_) => {
      const { targetId, planId, ...newPlanTask } = _;
      return {
        ...newPlanTask,
        targetId: _.targetId,
        fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        // name: convertTargetField(_.targetId, targets, fields).nameTarget,
      };
    });
    setCarts(convertPlanTasksToCarts);
    setCartEdit(planId);
    setSelectTarget("GIỎ MỤC TIÊU");
  };
  const handleSaveComment = async () => {
    setIsLoading(true);
    const indexPlan = plans.findIndex((plan) => plan.id === planId);
    editPlan(planId, {
      ...plans[indexPlan],
      comment: text ? `${user?.fullName}@Js@${text}` : "",
    });
    await updateDocData({
      nameCollect: "plans",
      id: planId,
      metaDoc: "plans",
      valueUpdate: { comment: text ? `${user?.fullName}@Js@${text}` : "" },
    });
    setIsLoading(false);
    setDisable(true);
  };
  const handleApproved = () => {
    const indexPlan = plans.findIndex((plan) => plan.id === planId);
    editPlan(planId, { ...plans[indexPlan], status: "approved" });

    setIsLoading(true);
    updateDocData({
      nameCollect: "plans",
      id: planId,
      valueUpdate: { status: "approved" },
      metaDoc: "plans",
    })
      .then(() => {
        setIsLoading(false);
        navigate("../pending");
        handleToastSuccess("Kế hoạch được duyệt thành công !");
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Duyệt kế hoạch thất bại !");
        console.log(error);
      });
  };
  const hanldeGroupPlanWithField = (planTasks: PlanTaskModel[]) => {
    return groupArrayWithField(planTasks.map((_) => {
      return { ..._, fieldId: convertTargetField(_.targetId, targets, fields).fieldId }
    }), 'fieldId')
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
        <TextComponent
          text={`${title}`}
          size={widthSmall ? sizes.thinTitle : sizes.bigTitle}
          styles={{ fontWeight: "bold" }}
        />
      </RowComponent>

      <div style={{ height: widthSmall ? "80%" : "85%", overflowY: "scroll" }}>
        <table className="table table-bordered" style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}>
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
              hanldeGroupPlanWithField(planTasks).map((_, index) => (
                <PendingItemComponent key={index} planTask={_} />
              ))}
          </tbody>
        </table>
        {isComment && (
          <>
            <TextComponent
              text={`Góp ý từ cô ${comment.split("@Js@")[0]}: `}
              size={sizes.bigText}
              styles={{ fontWeight: "bold" }}
            />
            <SpaceComponent height={4} />
            <RowComponent>
              <textarea
                ref={textareaPlanRef}
                style={{
                  padding: 10,
                  textAlign: "justify",
                  color: colors.red,
                }}
                disabled={
                  !["Phó Giám đốc", "Giám đốc"].includes(
                    user?.position as string
                  )
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="form-control"
                placeholder="Nhập comment"
                rows={5}
              ></textarea>
            </RowComponent>
            <SpaceComponent height={10} />
          </>
        )}
      </div>

      <SpaceComponent height={4} />

      <RowComponent justify="space-between" >
        {["Phó Giám đốc", "Giám đốc"].includes(user?.position as string) &&
          (isComment ? (
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
              <SaveAdd
                size={widthSmall ? sizes.smallTitle : sizes.bigTitle}
                color={colors.bacground}
              />
              <SpaceComponent width={6} />
              <TextComponent text="Lưu góp ý" color={colors.bacground} />
            </button>
          ) : (
            <div
              style={{
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setIsComment(true)}
            >
              <AddCircle
                size={widthSmall ? sizes.smallTitle : sizes.bigTitle}
                color={colors.primary}
                variant="Bold"
              />
              <SpaceComponent width={4} />
              <TextComponent
                text="Góp ý"
                size={widthSmall ? sizes.text : sizes.bigText}
              />
            </div>
          ))}

        {user?.role === "admin" && (
          <RowComponent
            styles={{
              cursor: "pointer",
            }}
            onClick={handleApproved}
          >
            <ArchiveTick
              size={widthSmall ? sizes.smallTitle : sizes.bigTitle}
              color={colors.primary}
              variant="Bold"
            />
            <TextComponent
              text="Duyệt"
              size={widthSmall ? sizes.text : sizes.bigText}
              styles={{ fontWeight: "bold" }}
            />
          </RowComponent>
        )}

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
            <Edit2
              size={widthSmall ? sizes.text : sizes.bigText}
              color={colors.bacground}
            />
            <SpaceComponent width={6} />
            <TextComponent
              text="Sửa"
              size={widthSmall ? sizes.text : sizes.bigText}
              color={colors.bacground}
            />
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
            <Trash size={widthSmall ? sizes.text : sizes.bigText} color={colors.bacground} />
            <SpaceComponent width={6} />
            <TextComponent text="Xóa" size={widthSmall ? sizes.text : sizes.bigText} color={colors.bacground} />
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
