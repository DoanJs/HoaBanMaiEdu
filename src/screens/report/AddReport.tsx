import { where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import { convertTargetField } from "../../constants/convertTargetAndField";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { functions } from "../../firebase.config";
import {
  PlanModel,
  PlanTaskModel,
  ReportSavedModel,
  UserModel,
} from "../../models";
import {
  useChildStore,
  useFieldStore,
  usePlanStore,
  useReportSavedStore,
  useReportStore,
  useSelectNavbarStore,
  useTargetStore,
  useTeacherStore,
  useUserStore,
} from "../../zustand";
import "./addReport.css";
import AddReportItem from "./AddReportItem";

// type ReportTarget = {
//   targetId: string;
//   fieldId?: string;
//   fieldName?: string;
//   name: string;
//   level?: string | number;
//   intervention?: string;
//   content?: string;
//   result?: string;
//   comment?: string;
// };

// const getPlanTargets = (plan: any): ReportTarget[] => {
//   return plan?.targets || plan?.goals || plan?.items || plan?.carts || [];
// };
function AddReportMobileCard({
  index,
  addReport,
  targets,
  fields,
  onOpenAiModal,
  onChangeTotal,
}: any) {
  const targetInfo = convertTargetField(addReport.targetId, targets, fields);

  return (
    <article className="add-report-mobile-card">
      <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className="goal-index">{index + 1}.</span>
            <span className="area-pill">{targetInfo.nameField}</span>
            <span className="goal-level">Level: {targetInfo.levelTarget}</span>
          </div>

          <h3 className="add-mobile-target-title">{targetInfo.nameTarget}</h3>
        </div>
      </div>

      <div className="add-mobile-section">
        <div className="add-mobile-label">
          <i className="bi bi-life-preserver me-2 text-warning-custom" />
          Mức độ hỗ trợ
        </div>
        <div className="add-mobile-content">
          {addReport.intervention || "Chưa có"}
        </div>
      </div>

      <div className="add-mobile-section">
        <div className="add-mobile-label">
          <i className="bi bi-journal-text me-2 text-green-dark" />
          Nội dung
        </div>
        <div className="add-mobile-content">
          {addReport.content || "Chưa có nội dung"}
        </div>
      </div>

      <div className="add-mobile-section">
        <div className="add-mobile-label d-flex justify-content-between align-items-center gap-2">
          <span>
            <i className="bi bi-chat-square-text-fill me-2 text-green-dark" />
            Tổng kết
          </span>

          <button
            type="button"
            className="btn-ai-summary-mobile"
            onClick={() => onOpenAiModal(addReport)}
          >
            <i className="bi bi-stars me-1" />
            Dùng AI
          </button>
        </div>

        <textarea
          className="form-control report-textarea mt-2"
          rows={5}
          placeholder="Nhập đánh giá, nhận xét..."
          value={addReport.total || ""}
          onChange={(e) => onChangeTotal(addReport.id, e.target.value)}
        />
      </div>
    </article>
  );
}
export default function AddReportBootstrapGreen() {
  const navigate = useNavigate();
  const { plans } = usePlanStore();
  const { teachers } = useTeacherStore();
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { user } = useUserStore();
  const { child } = useChildStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const [addReports, setAddReports] = useState<any[]>([]);
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<PlanModel>();
  const { addReport } = useReportStore();
  const [planApprovals, setPlanApprovals] = useState<PlanModel[]>([]);
  const { setSelectNavbar } = useSelectNavbarStore();
  const { reportSaveds, removeReportSaved, addReportSaved } =
    useReportSavedStore();
  const [isReportSaved, setIsReportSaved] = useState(false);
  const [planSelected, setPlanSelected] = useState(""); //nó chỉ là planId mà thôi
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiKeywordText, setAiKeywordText] = useState("");
  const [aiSelectedReport, setAiSelectedReport] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const groupedReports = useMemo(() => {
    if (!addReports?.length) return [];

    return groupArrayWithField(
      addReports.map((item) => ({
        ...item,
        fieldId: convertTargetField(item.targetId, targets, fields).fieldId,
      })),
      "fieldId",
    );
  }, [addReports, targets, fields]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "approved");
      setPlanApprovals(items);
    }
  }, [plans]);

  useEffect(() => {
    if (addReports.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [addReports]);

  useEffect(() => {
    if (planTasks) {
      // if (isReportSaved) {
      //   setAddReports(
      //     planTasks.map((planTask: any) => {
      //       const { id, ..._ } = planTask;
      //       return {
      //         ..._,
      //         reportSavedId: id,
      //         id: _.planTaskId,
      //       };
      //     })
      //   );
      // } else {
      //   setAddReports(planTasks);
      // }
      setAddReports(planTasks.map((item: any) => ({ ...item })));
    }
  }, [planTasks]);

  const handleSelectPlan = (planId: string) => {
    setPlanSelected(planId);
    if (planId !== "") {
      const index = planApprovals.findIndex((_) => _.id === planId);
      setPlan(planApprovals[index]);

      const items = reportSaveds
        .filter(
          (reportSaved: ReportSavedModel) => reportSaved.planId === planId,
        )
        .map((item: any) => ({ ...item }));
      if (items.length > 0) {
        setIsReportSaved(true);
        setPlanTasks(items);
      } else {
        setIsReportSaved(false);
        getDocsData({
          nameCollect: "planTasks",
          condition: [
            where("teacherIds", "array-contains", user?.id),
            where("planId", "==", planId),
          ],
          setData: setPlanTasks,
        });
      }
    } else {
      setPlanTasks([]);
      setDisable(true);
    }
  };

  const handleAddReport = async () => {
    if (!user || !child || !plan) return;

    setIsLoading(true);

    try {
      const res = await httpsCallable<
        {
          childId: string;
          planId: string;
          addReports: any[];
          isReportSaved: boolean;
        },
        {
          success: boolean;
          reportId: string;
          created: {
            reports: number;
            reportTasks: number;
          };
          deleted: {
            reportSaveds: number;
          };
        }
      >(
        functions,
        "createReportFromPlan",
      )({
        childId: child.id,
        planId: plan.id,
        addReports,
        isReportSaved,
      });

      addReport({
        id: res.data.reportId,
        type: "BC",
        title: plan.title as string,
        childId: child.id,
        teacherIds: child.teacherIds,
        authorId: user.id,
        planId: plan.id,
        status: "pending",
        comment: "",
        updateById: user.id,
        createAt: Date.now(),
        updateAt: Date.now(),
      });

      if (isReportSaved) {
        addReports.forEach((item) => {
          if (item.id) {
            removeReportSaved(item.id);
          }
        });
      }

      setIsReportSaved(false);

      handleToastSuccess(
        `Thêm mới báo cáo thành công! Đã tạo ${res.data.created.reportTasks} mục báo cáo.`,
      );

      navigate("../pending");
      setSelectNavbar("pending");
    } catch (error: any) {
      console.error(error);

      if (error.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền tạo báo cáo");
      } else if (error.code === "functions/failed-precondition") {
        handleToastError(
          error.message || "Không thể tạo báo cáo từ kế hoạch này",
        );
      } else if (error.code === "functions/not-found") {
        handleToastError("Không tìm thấy trẻ hoặc kế hoạch");
      } else {
        handleToastError("Thêm mới báo cáo thất bại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReportSaved = async () => {
    if (!child || !plan) return;

    setIsLoading(true);

    try {
      const res = await httpsCallable<
        {
          childId: string;
          planId: string;
          addReports: any[];
          isReportSaved: boolean;
        },
        {
          success: boolean;
          saved: {
            reportSaveds: number;
          };
          deleted: {
            reportSaveds: number;
          };
          items: any[];
        }
      >(
        functions,
        "saveReportSaveds",
      )({
        childId: child.id,
        planId: plan.id,
        addReports,
        isReportSaved,
      });

      // Nếu đang lưu lại bản nháp cũ thì xoá UI cũ
      if (isReportSaved) {
        addReports.forEach((item) => {
          if (item.id) {
            removeReportSaved(item.id);
          }
        });
      }

      // Thêm UI bản nháp mới từ CF trả về
      res.data.items.forEach((item) => {
        addReportSaved({
          ...item,
          createAt: Date.now(),
          updateAt: Date.now(),
        });
      });

      setIsReportSaved(true);
      setPlan(undefined);
      setPlanSelected("");
      setPlanTasks([]);
      setDisable(true);

      handleToastSuccess(
        `Lưu nháp báo cáo thành công! Đã lưu ${res.data.saved.reportSaveds} mục.`,
      );
    } catch (error: any) {
      console.error(error);

      if (error.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền lưu nháp báo cáo");
      } else if (error.code === "functions/not-found") {
        handleToastError("Không tìm thấy trẻ hoặc kế hoạch");
      } else {
        handleToastError("Lưu nháp báo cáo thất bại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAiModal = (report: any) => {
    setAiSelectedReport(report);
    setAiKeywordText("");
    setShowAiModal(true);
  };

  const handleCloseAiModal = () => {
    setShowAiModal(false);
    setAiSelectedReport(null);
    setAiKeywordText("");
  };

  const handleGenerateAiSummary = async () => {
    if (!user) {
      handleToastError("Bạn cần đăng nhập để dùng AI");
      return;
    }

    if (!aiSelectedReport) {
      handleToastError("Chưa chọn mục tiêu để tạo tổng kết");
      return;
    }

    const teacherBullets = aiKeywordText
      .split(/\n|,|;/)
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

    if (teacherBullets.length === 0) {
      handleToastError("Vui lòng nhập ít nhất một ý chính để AI tạo tổng kết");
      return;
    }

    const domain =
      convertTargetField(aiSelectedReport.targetId, targets, fields)
        .nameField || "";

    const supportText = aiSelectedReport.intervention || "";
    const teachingContent = aiSelectedReport.content || "";

    if (!domain) {
      handleToastError("Thiếu lĩnh vực của mục tiêu");
      return;
    }

    if (!supportText) {
      handleToastError("Thiếu mức độ hỗ trợ");
      return;
    }

    if (!teachingContent) {
      handleToastError("Thiếu nội dung can thiệp");
      return;
    }

    // setShowAiModal(false);
    setAiLoading(true);
    setIsLoading(true);

    try {
      const res = await httpsCallable<
        {
          goal: {
            domain: string;
            supportText: string;
            teachingContent: string;
            teacherBullets: string[];
          };
        },
        {
          ok: boolean;
          summary: string;
        }
      >(
        functions,
        "generateGoalSummaryAI",
      )({
        goal: {
          domain,
          supportText,
          teachingContent,
          teacherBullets,
        },
      });

      if (!res.data?.ok || !res.data?.summary?.trim()) {
        handleToastError("AI chưa tạo được nội dung tổng kết");
        return;
      }

      setAddReports((prev: any[]) =>
        prev.map((item) =>
          item.id === aiSelectedReport.id
            ? {
              ...item,
              total: res.data.summary.trim(),
            }
            : item,
        ),
      );

      handleToastSuccess("Đã tạo tổng kết bằng AI");
      setShowAiModal(false)

      setAiSelectedReport(null);
      setAiKeywordText("");
    } catch (error: any) {
      console.error("Generate AI summary error:", error);

      if (error.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập để dùng AI");
      } else if (error.code === "functions/invalid-argument") {
        handleToastError(error.message || "Thiếu dữ liệu để tạo tổng kết");
      } else if (error.code === "functions/resource-exhausted") {
        handleToastError("AI đang quá tải, vui lòng thử lại sau");
      } else {
        handleToastError("Không thể tạo tổng kết bằng AI");
      }
    } finally {
      setAiLoading(false);
      setIsLoading(false);
    }
  };

  const handleChangeTotal = (id: string, value: string) => {
    setAddReports((prev: any[]) =>
      prev.map((item) => (item.id === id ? { ...item, total: value } : item)),
    );
  };
  if (!plans) return <SpinnerComponent />;

  return (
    <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
      <div className="row align-items-start g-3 mb-3">
        <div className="col-12 col-lg">
          <h2 className="page-title fw-black text-green-dark mb-2">
            Tạo báo cáo can thiệp tháng
          </h2>
          <p className="fs-6 text-green-muted mb-0">
            Tạo báo cáo dựa vào kế hoạch can thiệp đã được duyệt
          </p>
        </div>
      </div>

      <div className="page-panel p-3 p-md-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-3">
            <label className="form-label fw-bold text-green-dark">
              Chọn kế hoạch đã duyệt
            </label>
            <select
              className="form-select filter-select"
              value={planSelected}
              onChange={(val) => handleSelectPlan(val.target.value)}
            >
              <option value="">Chọn kế hoạch</option>
              {planApprovals &&
                planApprovals.map((plan: any) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.type} {plan.title}
                  </option>
                ))}
            </select>
          </div>

          {plan && (
            <>
              <div className="col-12 col-md-4 col-lg-3">
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
              </div>

              <div className="col-12 col-md-4 col-lg-2">
                <div className="mini-info">
                  <i className="bi bi-calendar-heart icon-yellow" />
                  <span>
                    <b>Ngày gửi</b>
                    {typeof plan?.createAt === "number"
                      ? moment(plan?.createAt).format("HH:mm:ss DD/MM/YYYY")
                      : moment(handleTimeStampFirestore(plan?.createAt)).format(
                        "HH:mm:ss DD/MM/YYYY",
                      )}
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-4 col-lg-2">
                <div className="mini-info">
                  <i className="bi bi-calendar-heart icon-yellow" />
                  <span>
                    <b>Ngày duyệt</b>
                    {typeof plan?.updateAt === "number"
                      ? moment(plan?.updateAt).format("HH:mm:ss DD/MM/YYYY")
                      : moment(handleTimeStampFirestore(plan?.updateAt)).format(
                        "HH:mm:ss DD/MM/YYYY",
                      )}
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-4 col-lg-2">
                <div className="mini-info">
                  <i className="bi bi-bullseye icon-red" />
                  <span>
                    <b>Tổng mục tiêu</b>
                    {addReports.length} mục tiêu
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {plan ? (
        <>
          <div className="report-table-panel p-3 p-md-4 mb-4">
            <div className="table-responsive report-table-wrap">
              {/* <table className="table report-create-table align-middle">
                <thead>
                  <tr>
                    <th>Lĩnh vực</th>
                    <th>Mục tiêu</th>
                    <th>Mức độ hỗ trợ</th>
                    <th>Nội dung</th>
                    <th>Tổng kết</th>
                  </tr>
                </thead>

                <tbody>
                  {groupedReports.map((row) => (
                    <AddReportItem
                      key={`${row.fieldId}-${row.id}`}
                      addReport={row}
                      onChangeTotal={handleChangeTotal}
                      targets={targets}
                      fields={fields}
                      onOpenAiModal={handleOpenAiModal}
                    />
                  ))}
                </tbody>
              </table> */}
              <table className="table report-create-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Lĩnh vực</th>
                    <th>Mục tiêu</th>
                    <th>Mức độ hỗ trợ</th>
                    <th>Nội dung</th>
                    <th>Tổng kết</th>
                  </tr>
                </thead>

                <tbody>
                  {groupedReports.map((row) => (
                    <AddReportItem
                      key={`${row.fieldId}-${row.id}`}
                      addReport={row}
                      onChangeTotal={handleChangeTotal}
                      targets={targets}
                      fields={fields}
                      onOpenAiModal={handleOpenAiModal}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-goals">
              {groupedReports.map((row, index) => (
                <AddReportMobileCard
                  key={`${row.fieldId}-${row.id}-mobile`}
                  index={index}
                  addReport={row}
                  targets={targets}
                  fields={fields}
                  onOpenAiModal={handleOpenAiModal}
                  onChangeTotal={handleChangeTotal}
                />
              ))}
            </div>
          </div>

          {!disable && (
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                className="btn action-btn-soft"
                onClick={disable ? undefined : handleSaveReportSaved}
              >
                <i className="bi bi-save2-fill me-2" />
                Lưu bản nháp
              </button>

              <button
                className="btn action-btn-primary"
                onClick={disable ? undefined : handleAddReport}
              >
                <i className="bi bi-send-check-fill me-2" />
                Tạo báo cáo
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-create">
          <i className="bi bi-clipboard2-check fs-1 d-block mb-3" />
          Vui lòng chọn một kế hoạch đã duyệt để bắt đầu tạo báo cáo.
        </div>
      )}

      {showAiModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h5 className="fw-black text-green-dark mb-2">
              Tạo tổng kết bằng AI
            </h5>

            <p className="text-green-muted small">
              Nhập các ý chính giáo viên muốn đưa vào phần tổng kết. Mỗi ý nên
              xuống dòng riêng.
            </p>

            <textarea
              className="form-control"
              rows={6}
              placeholder={`Ví dụ:
- trẻ thực hiện tốt hơn khi có mẫu
- cần nhắc bằng lời
- đạt 7/10 cơ hội
- duy trì 3 ngày`}
              value={aiKeywordText}
              onChange={(e) => setAiKeywordText(e.target.value)}
            />

            <div className="d-flex gap-2 justify-content-end mt-3">
              <button
                className="btn action-btn-soft"
                onClick={handleCloseAiModal}
                disabled={aiLoading}
              >
                Huỷ
              </button>

              <button
                className="btn action-btn-primary"
                onClick={handleGenerateAiSummary}
                disabled={aiLoading}
              >
                <i className="bi bi-stars me-2" />
                {aiLoading ? "Đang tạo..." : "Tạo tổng kết"}
              </button>
            </div>
          </div>
        </div>
      )}

      <LoadingOverlay show={isLoading} />
    </section>
  );
}
