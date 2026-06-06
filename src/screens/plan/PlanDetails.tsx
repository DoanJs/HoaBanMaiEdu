import { doc, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Message } from "iconsax-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import { convertTargetField } from "../../constants/convertTargetAndField";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { exportWord } from "../../exportFile/WordExport";
import { db, functions } from "../../firebase.config";
import { PlanTaskModel, UserModel } from "../../models";
import {
  useCartEditStore,
  useCartStore,
  useChildStore,
  useCommentStore,
  useFieldStore,
  usePlanStore,
  useSelectNavbarStore,
  useTargetStore,
  useTeacherStore,
  useUserStore,
} from "../../zustand";
import "./plandetail.css";
import { addDocData } from "../../constants/firebase/addDocData";

export default function PlanDetailBootstrapGreen() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [text, setText] = useState("");
  const [disableComment, setDisableComment] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [historyComment, setHistoryComment] = useState(false);

  const location = useLocation();
  const { plan } = location.state || {};
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const { teachers } = useTeacherStore();
  const { plans, editPlan } = usePlanStore();
  const navigate = useNavigate();
  const { setSelectNavbar } = useSelectNavbarStore();
  const isPending = plan.status === "pending";
  const { setCarts } = useCartStore();
  const { setCartEdit } = useCartEditStore();
  const [showDelete, setShowDelete] = useState(false);
  const { removePlan } = usePlanStore();
  const { addComment, comments } = useCommentStore();

  // const myComments = comments.filter(cmt => cmt._id === plan.id)?.reverse() || []
  const myComments = useMemo(() => {
    return comments.filter((cmt) => cmt._id === plan.id).reverse();
  }, [comments, plan.id]);

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (plan) {
      getDocsData({
        nameCollect: "planTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("planId", "==", plan.id),
        ],
        setData: setPlanTasks,
      });
    }
    // eslint-disable-next-line
  }, [plan]);

  // useEffect(() => {
  //   if (myComments) {
  //     if (myComments.length > 0) {
  //       setIsComment(true);
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, [myComments]);

  useEffect(() => {
    setIsComment(myComments.length > 0);
  }, [myComments]);

  useEffect(() => {
    if (text !== myComments[0]?.content) {
      setDisableComment(false);
    } else {
      setDisableComment(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const handleEditPlan = () => {
    const convertPlanTasksToCarts = planTasks.map((_) => {
      const { targetId, planId, ...newPlanTask } = _;
      return {
        ...newPlanTask,
        targetId: _.targetId,
        fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        name: convertTargetField(_.targetId, targets, fields).nameTarget,
        level: convertTargetField(_.targetId, targets, fields).levelTarget,
      };
    });
    setCarts(convertPlanTasksToCarts);
    setCartEdit(plan.id);
    setSelectNavbar("cart");
  };

  const handleExportWordKH = () => {
    const items = hanldeGroupPlanWithField(planTasks).map(
      (planTask: PlanTaskModel) => {
        return {
          field: convertTargetField(planTask.targetId, targets, fields)
            .nameField,
          target: convertTargetField(planTask.targetId, targets, fields)
            .nameTarget,
          intervention: planTask.intervention,
          content: planTask.content,
        };
      },
    );

    exportWord(
      {
        rows: items,
        title: plan.title.trim(),
        child: child?.fullName,
        teacher: user?.fullName,
      },
      "/template_KH.docx",
    );
  };
  const hanldeGroupPlanWithField = (planTasks: PlanTaskModel[]) => {
    return groupArrayWithField(
      planTasks.map((_) => {
        return {
          ..._,
          fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        };
      }),
      "fieldId",
    );
  };

  const handleSaveComment = async () => {
    setShowFeedback(false);
    setIsLoading(true);
    const newComment = {
      _id: plan.id,
      authorId: user?.id || "",
      childId: child?.id || "",
      content: text,
      createAt: Date.now(),
      id: "",
      teacherIds: plan.teacherIds,
      type: "KH",
      updateAt: Date.now(),
    };

    addComment(newComment);

    await addDocData({
      nameCollect: "comments",
      value: {
        ...newComment,
        createAt: serverTimestamp(),
        updateAt: serverTimestamp(),
      },
      metaDoc: "comments",
    });

    await updateDoc(doc(db, "Meta", "comments"), {
      lastUpdated: serverTimestamp(),
    });
    await updateDocData({
      nameCollect: "plans",
      id: plan.id,
      metaDoc: "plans",
      valueUpdate: {
        comment: text,
        updateById: user?.id,
      },
    });

    setText("");
    setIsComment(true);
    setIsLoading(false);
    setDisableComment(true);
  };
  const handleApproved = () => {
    const indexPlan = plans.findIndex((p) => p.id === plan.id);
    editPlan(plan.id, { ...plans[indexPlan], status: "approved" });
    setIsLoading(true);
    updateDocData({
      nameCollect: "plans",
      id: plan.id,
      valueUpdate: { status: "approved", updateById: user?.id },
      metaDoc: "plans",
    })
      .then(() => {
        setIsLoading(false);
        navigate("../pending");
        setSelectNavbar("pending");
        handleToastSuccess("Kế hoạch được duyệt thành công !");
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Duyệt kế hoạch thất bại !");
        console.log(error);
      });
  };
  const handleDeletePlan = async () => {
    if (!plan) return;

    setShowDelete(false);
    setIsLoading(true);

    try {
      const res: any = await httpsCallable(
        functions,
        "deletePlan",
      )({
        planId: plan.id,
        mode: "hard",
      });

      const deleted = res.data.deleted;

      removePlan(plan.id);

      handleToastSuccess(
        `Đã xoá kế hoạch thành công cùng ${deleted.planTasks} chi tiết kế hoạch, 
        ${deleted.reports} báo cáo, 
        ${deleted.reportTasks} chi tiết báo cáo, 
        ${deleted.reportSaveds} bản lưu báo cáo, 
        ${deleted.comments} góp ý`,
      );

      navigate("../pending");
      setSelectNavbar("pending");
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền xoá kế hoạch");
      } else {
        handleToastError("Không thể xoá kế hoạch");
      }
    } finally {
      setIsLoading(false);
    }
  };

  function GoalMobileCard({ goal, index }: any) {
    return (
      <article className="goal-mobile-card">
        <div className="d-flex justify-content-between gap-3 mb-2">
          <div>
            <span className="goal-index">{index + 1}.</span>
            <span className="area-pill ms-2 me-3">
              {
                convertTargetField(goal.targetId, targets, fields).nameField
              }{" "}
            </span>
            <span className="goal-level">
              Level:{" "}
              {convertTargetField(goal.targetId, targets, fields).levelTarget}
            </span>
          </div>
        </div>
        <h3 className="mobile-goal-title">
          {convertTargetField(goal.targetId, targets, fields).nameTarget}
        </h3>
        <div className="mobile-section">
          <b>Mức độ hỗ trợ: </b> {goal.intervention}
        </div>
        <div className="mobile-section">
          <b>Nội dung:</b> {goal.content}
        </div>
      </article>
    );
  }
  if (!plan) return <SpinnerComponent />;

  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h2
                className="page-title fw-black text-green-dark mb-2 me-3"
                title={plan.id}
              >
                {plan.title}
              </h2>
              {isPending ? (
                <span className="pending-badge">
                  <i className="bi bi-hourglass-split me-1" />
                  Chờ duyệt
                </span>
              ) : (
                <span className="status-approved">
                  <i className="bi bi-patch-check-fill me-1" />
                  Đã duyệt
                </span>
              )}
            </div>
            <p className="fs-6 text-green-muted mb-0">
              Chi tiết mục tiêu, mức độ hỗ trợ và nội dung can thiệp cho trẻ.
            </p>
          </div>
          <div className="col-12 col-lg-auto d-flex gap-2 flex-wrap">
            {!isPending && (
              <button
                onClick={handleExportWordKH}
                className="btn action-btn-primary"
              >
                <i className="bi bi-cloud-arrow-down-fill me-2" />
                Xuất file
              </button>
            )}
          </div>
        </div>

        <div className="plan-hero mb-4">
          <div className="row g-4 align-items-start">
            <div className="col-12">
              <div className="info-grid">
                <div className="mini-info">
                  <i className="bi bi-person-check-fill icon-red" />
                  <span>
                    <b>Giáo viên thực hiện</b>
                    {
                      teachers.find((_: UserModel) => _.id === plan.authorId)
                        ?.fullName
                    }
                  </span>
                </div>
                <div className="mini-info">
                  <i className="bi bi-calendar-plus icon-red" />
                  <span>
                    <b>Ngày gửi</b>
                    {typeof plan?.createAt === "number"
                      ? moment(plan?.createAt).format("HH:mm:ss DD/MM/YYYY")
                      : moment(handleTimeStampFirestore(plan?.createAt)).format(
                          "HH:mm:ss DD/MM/YYYY",
                        )}
                  </span>
                </div>
                <div className="mini-info">
                  <i className="bi bi-calendar-check icon-yellow" />
                  <span>
                    <b>Ngày duyệt</b>
                    {(!isPending &&
                      moment(handleTimeStampFirestore(plan?.updateAt)).format(
                        "HH:mm:ss DD/MM/YYYY",
                      )) ||
                      "Đang chờ..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="plan-detail-panel p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
            <div>
              <h3 className="h5 fw-black text-green-dark mb-1">
                Bảng nội dung kế hoạch
              </h3>
              <div className="small text-green-muted fw-semibold">
                Nội dung cụ thể của kế hoạch can thiệp trong tháng
              </div>
            </div>

            <div className="text-md-end">
              <span className="status-approved">
                <i className="bi bi-list-check me-2" />
                {planTasks.length} mục tiêu hiển thị
              </span>
            </div>
          </div>

          <div className="plan-table-wrap mb-3">
            <div className="table-responsive plan-table-wrap">
              <table className="table plan-table align-middle mb-0">
                <thead>
                  <tr>
                    <th className="area-cell">Lĩnh vực</th>
                    <th className="goal-cell">Mục tiêu</th>
                    <th className="support-cell">Mức độ hỗ trợ</th>
                    <th className="content-cell">Nội dung</th>
                  </tr>
                </thead>

                <tbody>
                  {planTasks.length > 0 &&
                    hanldeGroupPlanWithField(planTasks).map((goal) => {
                      const data = convertTargetField(
                        goal.targetId,
                        targets,
                        fields,
                      );

                      return (
                        <tr key={goal.id}>
                          <td className="area-cell">{data.nameField}</td>

                          <td className="goal-cell">
                            <div className="fw-semibold text-green-dark">
                              {data.nameTarget}
                            </div>

                            <div>
                              <span className="goal-level">
                                Level: {data.levelTarget}
                              </span>
                            </div>
                          </td>

                          <td className="support-cell">{goal.intervention}</td>

                          <td className="content-cell">{goal.content}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile-goals">
            {hanldeGroupPlanWithField(planTasks).map((goal, index) => (
              <GoalMobileCard key={goal.id} goal={goal} index={index} />
            ))}
          </div>

          {isPending && isComment && (
            <div className="d-flex align-items-start justify-content-between comment-total">
              <div className="plan-hero feedback-box flex-grow-1 mb-3 comment-content me-2">
                <Message color="#ef4444" size={26} variant="Bold" />

                <div className="ms-2">
                  <span className="text-danger-custom">
                    Góp ý từ cô{" "}
                    <b>
                      {teacherMap[myComments[0]?.authorId]?.fullName ||
                        user?.fullName}
                    </b>{" "}
                    vào lúc{" "}
                    {typeof myComments[0]?.createAt === "number"
                      ? moment(myComments[0]?.createAt).format(
                          "HH:mm:ss DD/MM/YYYY",
                        )
                      : moment(
                          handleTimeStampFirestore(myComments[0]?.createAt),
                        ).format("HH:mm:ss DD/MM/YYYY")}
                    :
                  </span>

                  <div className="mt-1 feedback-content">
                    {myComments[0]?.content}
                  </div>
                </div>
              </div>

              <button
                className="btn action-btn-comment flex-shrink-0"
                onClick={() => setHistoryComment(true)}
              >
                <i className="bi bi-send-check-fill me-2" />
                Lịch sử góp ý
              </button>
            </div>
          )}

          {isPending && (
            <div className="pending-actions mt-3 border-top-soft">
              {["Phó Giám đốc", "Giám đốc"].includes(
                user?.position as string,
              ) && (
                <button
                  className="btn action-btn-soft"
                  onClick={() => setShowFeedback(true)}
                >
                  <i className="bi bi-chat-left-dots-fill me-2 icon-yellow" />
                  Góp ý
                </button>
              )}
              {user?.role === "admin" && (
                <button className="btn approve-btn" onClick={handleApproved}>
                  <i className="bi bi-check-circle-fill me-2" />
                  Duyệt
                </button>
              )}
              <div className="ms-auto d-flex gap-2">
                <Link
                  to={"../cart"}
                  className="btn action-btn-primary"
                  onClick={handleEditPlan}
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Chỉnh sửa
                </Link>
                <button
                  onClick={() => setShowDelete(true)}
                  className="btn reject-btn"
                >
                  <i className="bi bi-trash3-fill me-2" />
                  Xóa
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {isPending && historyComment && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal-history-comment">
            <h5 className="fw-black text-green-dark mb-2">Lịch sử góp ý</h5>
            <p className="text-green-muted small">
              Góp ý sẽ được lưu lại phục vụ đánh giá năng lực của Quản lý chuyên
              môn.
            </p>
            <div className="table-responsive comment-table-wrap">
              <table className="table comment-table align-middle mb-0">
                <thead>
                  <tr>
                    <th className="area-cell">Thời gian</th>
                    <th className="goal-cell">Giáo viên</th>
                    <th className="content-cell">Nội dung</th>
                  </tr>
                </thead>

                <tbody>
                  {myComments.length > 0 &&
                    myComments.map((cmt, index) => {
                      return (
                        <tr key={`cmt-${cmt.id}-${index}`}>
                          <td>
                            {typeof cmt?.createAt === "number"
                              ? moment(cmt?.createAt).format(
                                  "HH:mm:ss DD/MM/YYYY",
                                )
                              : moment(
                                  handleTimeStampFirestore(cmt?.createAt),
                                ).format("HH:mm:ss DD/MM/YYYY")}
                          </td>

                          <td className="d-flex align-items-center">
                            <img
                              alt="avatar"
                              src={teacherMap[cmt.authorId]?.avatar}
                              className="comment-avatar"
                            />
                            <div className="fw-semibold text-green-dark">
                              {teacherMap[cmt.authorId]?.fullName}
                            </div>
                          </td>

                          <td>{cmt.content}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button
                className="btn action-btn-soft"
                onClick={() => setHistoryComment(false)}
              >
                Hủy
              </button>
              {["Phó Giám đốc", "Giám đốc"].includes(
                user?.position as string,
              ) && (
                <button
                  className="btn action-btn-soft"
                  onClick={() => {
                    setHistoryComment(false);
                    setShowFeedback(true);
                  }}
                >
                  <i className="bi bi-chat-left-dots-fill me-2 icon-yellow" />
                  Góp ý
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isPending && showFeedback && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h5 className="fw-black text-green-dark mb-2">Góp ý kế hoạch</h5>
            <p className="text-green-muted small">
              Góp ý sẽ được gửi lại cho giáo viên chỉnh sửa trước khi duyệt kế
              hoạch.
            </p>
            <textarea
              className="form-control filter-select"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập nội dung góp ý..."
            />
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button
                className="btn action-btn-soft"
                onClick={() => setShowFeedback(false)}
              >
                Hủy
              </button>
              <button
                className="btn action-btn-primary"
                onClick={disableComment ? undefined : handleSaveComment}
                disabled={!text.trim() || text === myComments[0]?.content}
              >
                <i className="bi bi-send-check-fill me-2" />
                Gửi góp ý
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            {/* Title */}
            <h5 className="fw-black text-danger mb-2">Xác nhận xoá kế hoạch</h5>

            {/* Description */}
            <p className="text-green-muted small">
              Hành động này sẽ xoá toàn bộ nội dung kế hoạch và không thể khôi
              phục.
            </p>

            {/* Plan info */}
            <div className="plan-delete-box mt-2">
              <div className="small">
                <strong>Tháng:</strong> {plan.title}
              </div>
              <div className="small">
                <strong>Mã kế hoạch:</strong> {plan.id}
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button
                className="btn action-btn-soft"
                onClick={() => setShowDelete(false)}
              >
                Huỷ
              </button>

              <button
                className="btn action-btn-danger"
                onClick={handleDeletePlan}
              >
                <i className="bi bi-trash me-2" />
                Xoá kế hoạch
              </button>
            </div>
          </div>
        </div>
      )}

      <LoadingOverlay show={isLoading} />
    </>
  );
}
