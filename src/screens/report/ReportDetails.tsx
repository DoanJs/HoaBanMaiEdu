import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Message } from "iconsax-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverLay";
import { colors } from "../../constants/colors";
import { convertTargetField } from "../../constants/convertTargetAndField";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { getDocData } from "../../constants/firebase/getDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { exportWord } from "../../exportFile/WordExport";
import { db, functions } from "../../firebase.config";
import { PlanTaskModel, ReportTaskModel, UserModel } from "../../models";
import {
  useChildStore,
  useCommentStore,
  useFieldStore,
  useReportStore,
  useSelectNavbarStore,
  useTargetStore,
  useTeacherStore,
  useUserStore,
} from "../../zustand";
import "./reportdetail.css";
import ReportItem from "./ReportItem";
import { addDocData } from "../../constants/firebase/addDocData";

function ReportMobileCard({
  index,
  reportTask,
  reportTasks,
  onSetReportTasks,
  setDisable,
  status,
  targets,
  fields,
}: any) {
  const [planTask, setPlanTask] = useState<PlanTaskModel>();
  const [content, setContent] = useState("");
  const [contentSource, setContentSource] = useState("");

  useEffect(() => {
    if (reportTask) {
      getDocData({
        id: reportTask.planTaskId,
        nameCollect: "planTasks",
        setData: setPlanTask,
      });
      setContent(reportTask.content);
      setContentSource(reportTask.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportTask]);

  useEffect(() => {
    const index = reportTasks.findIndex((_: any) => _.id === reportTask.id);
    if (content && content !== contentSource) {
      reportTasks[index].content = content;
      reportTasks[index].isEdit = true;
      onSetReportTasks(reportTasks);
    } else {
      reportTasks[index].isEdit = false;
    }

    const isEdit = reportTasks.some((reportTask: any) => reportTask.isEdit);
    setDisable(!isEdit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const showTarget = () => {
    if (planTask) {
      const indexTarget = targets.findIndex(
        (target: any) => target.id === planTask.targetId,
      );
      if (indexTarget !== -1) {
        const indexField = fields.findIndex(
          (_: any) => _.id === targets[indexTarget].fieldId,
        );
        return {
          target: targets[indexTarget],
          field: fields[indexField],
        };
      }
    }
  };

  return (
    <article className="goal-mobile-card">
      <div className="d-flex justify-content-between gap-3 mb-2">
        <div>
          <span className="goal-index">{index + 1}.</span>
          <span className="area-pill ms-2 me-3">
            {showTarget()?.field.name}
          </span>
          <span className="goal-level">
            Level: {showTarget()?.target.level}
          </span>
        </div>
      </div>
      <h3  style={{textAlign: 'justify'}} className="mobile-goal-title">{showTarget()?.target.name}</h3>
      <div className="mobile-section">
        <b>Mức độ hỗ trợ:</b> {planTask?.intervention}
      </div>
      <div  style={{textAlign: 'justify'}} className="mobile-section">
        <b>Nội dung:</b> {planTask?.content}
      </div>
      <div  style={{textAlign: 'justify'}} className="mobile-section">
        <b>Tổng kết:</b>{" "}
        {status === "pending" ? (
          <textarea
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            placeholder="Nhập đánh giá"
            rows={6}
            cols={100}
            style={{ borderColor: colors.primary }}
            id="floatingTextarea2"
            value={content}
          ></textarea>
        ) : (
          content
        )}
      </div>
    </article>
  );
}

export default function ReportDetailBootstrapGreen() {
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { report } = location.state || {};
  const [reportTasks, setReportTasks] = useState<ReportTaskModel[]>([]);
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const [disableComment, setDisableComment] = useState(true);
  const [isComment, setIsComment] = useState(false);
  const [text, setText] = useState("");
  const { reports, editReport } = useReportStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const { teachers } = useTeacherStore();
  const { setSelectNavbar } = useSelectNavbarStore();
  const isPending = report.status === "pending";
  const [showDelete, setShowDelete] = useState(false);
  const [historyComment, setHistoryComment] = useState(false);
  const { removeReport } = useReportStore();
  const { addComment, comments } = useCommentStore();

  // const myComments = comments.filter(cmt => cmt._id === report.id)?.reverse() || []
  const myComments = useMemo(() => {
    return comments.filter((cmt) => cmt._id === report.id);
  }, [comments, report.id]);

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (report) {
      getDocsData({
        nameCollect: "reportTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("reportId", "==", report.id),
        ],
        setData: setReportTasks,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);
  
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

  useEffect(() => {
    if (reportTasks.length > 0) {
      getPlanTasks(reportTasks);
    }
  }, [reportTasks]);

  const getPlanTasks = async (reportTasks: ReportTaskModel[]) => {
    const promiseItems = reportTasks.map(async (reportTask) => {
      const docSnap = await getDoc(doc(db, "planTasks", reportTask.planTaskId));
      return {
        ...docSnap.data(),
        id: docSnap.id,
      };
    });
    const result = await Promise.all(promiseItems);

    setPlanTasks(result as PlanTaskModel[]);
  };

  const handleSaveReportTask = async () => {
    if (disable) return;

    setIsLoading(true);

    try {
      const res: any = await httpsCallable(
        functions,
        "updateReportTasks",
      )({
        reportId: report.id,
        reportTasks,
      });

      handleToastSuccess(
        `Đã cập nhật ${res.data.updatedCount} mục chi tiết báo cáo`,
      );

      setDisable(true);
    } catch (error: any) {
      console.log(error);

      if (error.code === "functions/failed-precondition") {
        handleToastError("Báo cáo đã duyệt, không thể chỉnh sửa");
      } else {
        handleToastError("Chỉnh sửa báo cáo thất bại !");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleExportWordBC = async () => {
    setIsLoading(true);
    const promiseItems = handleGroupReportWithField(reportTasks).map(
      async (reportTask: ReportTaskModel) => {
        const docSnap = await getDoc(
          doc(db, "planTasks", reportTask.planTaskId),
        );
        if (docSnap.exists()) {
          return {
            intervention: docSnap.data().intervention,
            content: docSnap.data().content,
            field: convertTargetField(docSnap.data().targetId, targets, fields)
              .nameField,
            target: convertTargetField(docSnap.data().targetId, targets, fields)
              .nameTarget,
            total: reportTask.content,
          };
        } else {
          console.log(`getDoc data error`);
        }
      },
    );
    const result = await Promise.all(promiseItems);

    exportWord(
      {
        rows: result,
        title: report.title.trim(),
        child: child?.fullName,
        teacher: user?.fullName,
      },
      "/template_BC.docx",
    );
    setIsLoading(false);
  };
  const handleSaveComment = async () => {
    setShowFeedback(false);
    setIsLoading(true);
    const newComment = {
      _id: report.id,
      authorId: user?.id || "",
      childId: child?.id || "",
      content: text,
      createAt: Date.now(),
      id: "",
      teacherIds: report.teacherIds,
      type: "BC",
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
      nameCollect: "reports",
      id: report.id,
      metaDoc: "reports",
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
    const indexReport = reports.findIndex((r) => r.id === report.id);
    editReport(report.id, { ...reports[indexReport], status: "approved" });

    setIsLoading(true);
    updateDocData({
      nameCollect: "reports",
      id: report.id,
      valueUpdate: { status: "approved", updateById: user?.id },
      metaDoc: "reports",
    })
      .then(() => {
        setIsLoading(false);
        navigate("../pending");
        setSelectNavbar("pending");
        handleToastSuccess("Báo cáo được duyệt thành công !");
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Duyệt báo cáo thất bại !");
        console.log(error);
      });
  };
  const getPlanTask = (planTaskId: string, planTasks: PlanTaskModel[]) => {
    const index = planTasks.findIndex((pt) => pt.id === planTaskId);
    if (index !== -1) {
      return planTasks[index];
    }
  };
  const handleGroupReportWithField = (reportTasks: ReportTaskModel[]) => {
    return groupArrayWithField(
      reportTasks.map((rt) => {
        return {
          ...rt,
          fieldId: convertTargetField(
            getPlanTask(rt.planTaskId, planTasks)?.targetId as string,
            targets,
            fields,
          ).fieldId,
        };
      }),
      "fieldId",
    );
  };
  const handleDeleteReport = async () => {
    if (!report) return;

    setShowDelete(false);
    setIsLoading(true);

    try {
      const res: any = await httpsCallable(
        functions,
        "deleteReport",
      )({
        reportId: report.id,
      });

      removeReport(report.id);

      handleToastSuccess(
        `Xóa báo cáo thành công cùng ${res.data.deletedCount} mục chi tiết báo cáo.`,
      );

      navigate("../pending");
      setSelectNavbar("pending");
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền xoá báo cáo");
      } else if (err.code === "functions/failed-precondition") {
        handleToastError("Không được xoá báo cáo đã duyệt");
      } else {
        handleToastError("Không thể xoá báo cáo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const groupedReportTasks = useMemo(() => {
    if (!reportTasks?.length) return [];

    return handleGroupReportWithField(reportTasks);
  }, [reportTasks, planTasks, targets, fields]);

  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h2
                className="page-title fw-black text-green-dark mb-2 me-3"
                title={report.id}
              >
                {report.title}
              </h2>
              {/* <span className="report-code me-3">{report.id}</span> */}
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
              Chi tiết đánh giá, nhận xét mục tiêu cho trẻ.
            </p>
          </div>

          <div className="col-12 col-lg-auto d-flex gap-2 flex-wrap">
            {!isPending && (
              <button
                onClick={handleExportWordBC}
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
                      teachers.find((_: UserModel) => _.id === report.authorId)
                        ?.fullName
                    }
                  </span>
                </div>
                <div className="mini-info">
                  <i className="bi bi-calendar-plus icon-red" />
                  <span>
                    <b>Ngày gửi</b>
                    {typeof report?.createAt === "number"
                      ? moment(report?.createAt).format("HH:mm:ss DD/MM/YYYY")
                      : moment(
                          handleTimeStampFirestore(report?.createAt),
                        ).format("HH:mm:ss DD/MM/YYYY")}
                  </span>
                </div>
                <div className="mini-info">
                  <i className="bi bi-calendar-check icon-yellow" />
                  <span>
                    <b>Ngày duyệt</b>
                    {(!isPending &&
                      moment(handleTimeStampFirestore(report?.updateAt)).format(
                        "HH:mm:ss DD/MM/YYYY",
                      )) ||
                      "Đang chờ..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="report-detail-panel p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
            <div>
              <h3 className="h5 fw-black text-green-dark mb-1">
                Bảng chi tiết báo cáo
              </h3>
              <div className="small text-green-muted fw-semibold">
                Đánh giá từng mục tiêu trong kế hoạch tháng
              </div>
            </div>

            <div className="text-md-end">
              <span className="status-approved">
                <i className="bi bi-list-check me-2" />
                {reportTasks.length} mục tiêu
              </span>
            </div>
          </div>

          <div className="report-table-wrap mb-3">
            <div className="table-responsive">
              <table className="table report-table align-middle mb-0">
                <thead>
                  <tr style={{textAlign: 'center'}}>
                    <th style={{width: '8%'}} className="area-cell">Lĩnh vực</th>
                    <th style={{width: '20%'}} className="goal-cell">Mục tiêu</th>
                    <th style={{width: '8%'}} className="support-cell">Mức độ hỗ trợ</th>
                    <th style={{width: '20%'}} className="content-cell">Nội dung</th>
                    <th style={{width: '44%'}} className="observe-cell">Tổng kết</th>
                  </tr>
                </thead>

                <tbody>
                  {groupedReportTasks.map((item) => (
                    <ReportItem
                      key={item.id}
                      reportTask={item}
                      setDisable={setDisable}
                      reportTasks={reportTasks}
                      onSetReportTasks={setReportTasks}
                      status={report.status}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile-goals">
            {groupedReportTasks.map((item, index) => (
              <ReportMobileCard
                key={item.id}
                index={index}
                reportTask={item}
                reportTasks={reportTasks}
                onSetReportTasks={setReportTasks}
                setDisable={setDisable}
                status={report?.status}
                targets={targets}
                fields={fields}
              />
            ))}
          </div>

          {isPending && isComment && (
            <div className="d-flex align-items-start justify-content-between comment-total">
              <div className="plan-hero feedback-box flex-grow-1 comment-content me-2 mb-3">
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
                <button
                  className="btn action-btn-primary"
                  onClick={!disable ? handleSaveReportTask : undefined}
                >
                  <i className="bi bi-save2-fill me-2" />
                  Lưu chỉnh sửa
                </button>
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
                    [...myComments].reverse().map((cmt, index) => {
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
            <h5 className="fw-black text-green-dark mb-2">Góp ý báo cáo</h5>
            <p className="text-green-muted small">
              Góp ý sẽ được gửi lại cho giáo viên chỉnh sửa trước khi duyệt báo
              cáo.
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
                disabled={
                  !text.trim() || text === report.comment?.split("@Js@")[1]
                }
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
            <h5 className="fw-black text-danger mb-2">Xác nhận xoá báo cáo</h5>

            {/* Description */}
            <p className="text-green-muted small">
              Hành động này sẽ xoá toàn bộ nội dung báo cáo và không thể khôi
              phục.
            </p>

            {/* Plan info */}
            <div className="plan-delete-box mt-2">
              <div className="small">
                <strong>Tháng:</strong> {report.title}
              </div>
              <div className="small">
                <strong>Mã báo cáo:</strong> {report.id}
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
                onClick={handleDeleteReport}
              >
                <i className="bi bi-trash me-2" />
                Xoá báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      <LoadingOverlay show={isLoading} />
    </>
  );
}
