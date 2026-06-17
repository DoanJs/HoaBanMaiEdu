import { serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import LoadingOverlay from "../../components/LoadingOverLay";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { functions } from "../../firebase.config";
import { useUserStore } from "../../zustand";

// interface OptionType {
//   id: string;
//   fullName: string;
// }

export default function AdminReport() {
  const { user } = useUserStore();

  const [reports, setReports] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  const [reportEdit, setReportEdit] = useState<any>();
  const [selectTeachers, setSelectTeachers] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    title: "",
    status: "",
  });

  useEffect(() => {
    if (user) {
      getDocsData({ nameCollect: "reports", setData: setReports });
      getDocsData({ nameCollect: "children", setData: setChildren });
      getDocsData({ nameCollect: "users", setData: setTeachers });
      getDocsData({ nameCollect: "plans", setData: setPlans });
    }
  }, [user]);

  const childMap = useMemo(() => {
    const map: any = {};
    children.forEach((child: any) => {
      map[child.id] = child.fullName;
    });
    return map;
  }, [children]);

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((teacher: any) => {
      map[teacher.id] = teacher.fullName;
    });
    return map;
  }, [teachers]);

  const planMap = useMemo(() => {
    const map: any = {};
    plans.forEach((plan: any) => {
      map[plan.id] = plan.title;
    });
    return map;
  }, [plans]);

  const filteredReports = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return reports.filter((item: any) => {
      const childName = childMap[item.childId] || "";
      const planTitle = planMap[item.planId] || "";

      const teacherNames = (item.teacherIds || [])
        .map((id: string) => teacherMap[id] || "")
        .join(" ");

      const content = `
        ${item.id ?? ""}
        ${item.title ?? ""}
        ${item.status ?? ""}
        ${item.planId ?? ""}
        ${planTitle}
        ${childName}
        ${teacherNames}
      `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [reports, keyword, childMap, teacherMap, planMap]);

  useEffect(() => {
    if (reportEdit) {
      setForm({
        title: reportEdit.title || "",
        status: reportEdit.status || "",
      });

      const selected = (reportEdit.teacherIds || [])
        .map((id: string) => teachers.find((t: any) => t.id === id))
        .filter(Boolean);

      setSelectTeachers(selected);
    }
  }, [reportEdit, teachers]);

  const handleCloseEdit = () => {
    setReportEdit(undefined);
    setForm({
      title: "",
      status: "",
    });
    setSelectTeachers([]);
  };

  const isDisabled =
    !form.title.trim() || !form.status || selectTeachers.length === 0;

  const handleUpdateReport = async () => {
    if (!reportEdit) return;

    const data = {
      title: form.title,
      status: form.status,
    };

    setIsLoading(true);

    updateDocData({
      nameCollect: "reports",
      id: reportEdit.id,
      valueUpdate: {
        ...data,
        updateAt: serverTimestamp(),
      },
      metaDoc: "reports",
    })
      .then(() => {
        setReports((prev) =>
          prev.map((report) =>
            report.id === reportEdit.id
              ? {
                  ...report,
                  ...data,
                  updateAt: new Date(),
                }
              : report,
          ),
        );

        handleToastSuccess(`Cập nhật báo cáo thành công! (${reportEdit.id})`);
        handleCloseEdit();
      })
      .catch(() => {
        handleToastError("Cập nhật báo cáo thất bại!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteReport = async () => {
    if (!reportEdit) return;

    setShowDelete(false);
    setIsLoading(true);

    try {
      const deleteReportCF = httpsCallable<
        { reportId: string },
        {
          success: boolean;
          deleted: {
            reports: number;
            reportTasks: number;
          };
          deletedCount: number;
        }
      >(functions, "deleteReport");

      const res = await deleteReportCF({
        reportId: reportEdit.id,
      });

      setReports((prev) =>
        prev.filter((report) => report.id !== reportEdit.id),
      );

      handleCloseEdit();

      handleToastSuccess(
        `Xóa báo cáo thành công! Đã xóa ${res.data.deletedCount} mục liên quan.`,
      );

      console.log("Chi tiết đã xóa:", res.data.deleted);
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền xoá báo cáo");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy báo cáo");
      } else if (err.code === "functions/failed-precondition") {
        handleToastError("Chỉ được xoá báo cáo đang pending");
      } else if (err.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập lại");
      } else {
        handleToastError("Xóa báo cáo thất bại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleDeleteReport = async () => {
  //   if (!reportEdit) return;

  //   setShowDelete(false);

  //   try {
  //     setIsLoading(true);

  //     const deleteReportDeep = httpsCallable<
  //       { reportId: string },
  //       {
  //         ok: boolean;
  //         deletedReportId: string;
  //         deletedRelatedDocs: number;
  //       }
  //     >(functions, "deleteReportDeep");

  //     const res = await deleteReportDeep({ reportId: reportEdit.id });

  //     setReports((prev) =>
  //       prev.filter((report) => report.id !== reportEdit.id),
  //     );

  //     handleCloseEdit();

  //     handleToastSuccess(
  //       `Xóa báo cáo thành công! Đã xóa ${res.data.deletedRelatedDocs} mục có liên quan.`,
  //     );
  //   } catch (err: any) {
  //     console.error(err);

  //     if (err.code === "permission-denied") {
  //       handleToastError("Chỉ admin mới có quyền xóa báo cáo");
  //     } else if (err.code === "not-found") {
  //       handleToastError("Không tìm thấy báo cáo");
  //     } else {
  //       handleToastError("Xóa báo cáo thất bại");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const scrollToEditForm = () => {
    if (window.innerWidth >= 1200) return;

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <>
      <div className="admin-target-page">
        <div className="row g-3 g-xl-4 admin-content">
          <div
            className={
              reportEdit
                ? "col-12 col-xl-8 admin-table-col"
                : "col-12 admin-table-col"
            }
          >
            <div className="page-panel p-3 p-md-4 h-100 d-flex flex-column">
              <div className="search-box mb-3 d-flex align-items-center justify-content-between">
                <div className="search-left">
                  <i className="bi bi-search me-2 text-muted" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="form-control search-input"
                    placeholder="Nhập báo cáo"
                  />
                </div>

                <div className="child-count">
                  Có {filteredReports.length} báo cáo
                </div>
              </div>

              <div className="table-responsive">
                {filteredReports.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-search empty-icon" />
                    <div className="empty-text">
                      Không tìm thấy báo cáo phù hợp.
                    </div>
                  </div>
                ) : (
                  <table className="table plans-table align-middle">
                    <thead>
                      <tr>
                        <th>Tên trẻ</th>
                        <th>Kế hoạch</th>
                        <th>Báo cáo</th>
                        <th>Trạng thái</th>
                        <th>Handle</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredReports.map((report: any) => (
                        <tr key={report.id}>
                          <td>{childMap[report.childId] || "-"}</td>

                          <td>{planMap[report.planId] || "-"}</td>

                          <td>
                            {report.title} - <b>{report.id}</b>
                          </td>

                          <td>{report.status}</td>

                          <td>
                            <button
                              className="icon-btn icon-edit"
                              onClick={() => {
                                setReportEdit(report);
                                scrollToEditForm();
                              }}
                            >
                              <i className="bi bi-pencil-fill" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {reportEdit && (
            <div className="col-12 col-xl-4 admin-form-col">
              <div
                ref={formRef}
                className="page-panel qx-add-child-panel p-3 p-md-4 position-relative h-100"
              >
                <button
                  className="icon-btn icon-delete position-absolute"
                  style={{ top: 12, left: 12 }}
                  onClick={() => setShowDelete(true)}
                  disabled={isLoading}
                >
                  <i className="bi bi-trash-fill" />
                </button>

                <button
                  className="icon-btn icon-add position-absolute"
                  style={{ top: 12, right: 12 }}
                  onClick={handleCloseEdit}
                  disabled={isLoading}
                >
                  <i className="bi bi-x-lg" />
                </button>

                <h4 className="text-center fw-bold mb-3">Chỉnh sửa báo cáo</h4>

                <label className="form-label">Tên báo cáo:</label>
                <input
                  className="form-control mb-2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <label className="form-label">Trạng thái:</label>
                <select
                  className="form-select mb-2"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>

                <label className="form-label">Giáo viên phụ trách:</label>
                <Select
                  className="mb-2"
                  getOptionLabel={(option) => option.fullName}
                  getOptionValue={(option) => option.id.toString()}
                  isMulti
                  options={teachers}
                  value={selectTeachers}
                  isDisabled // 👈 khóa lại
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />

                <button
                  className="btn action-btn-primary w-100"
                  disabled={isDisabled || isLoading}
                  onClick={handleUpdateReport}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LoadingOverlay show={isLoading} />

      {showDelete && reportEdit && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h5 className="fw-black text-danger mb-2">Xác nhận xoá báo cáo</h5>

            <p className="text-green-muted small">
              Hành động này sẽ xoá toàn bộ báo cáo và các nhiệm vụ báo cáo liên
              quan, không thể khôi phục.
            </p>

            <div className="plan-delete-box mt-2">
              <div className="small">
                <strong>Tên báo cáo:</strong> {reportEdit.title}
              </div>
              <div className="small">
                <strong>Mã báo cáo:</strong> {reportEdit.id}
              </div>
              <div className="small">
                <strong>Mã kế hoạch:</strong> {reportEdit.planId || "-"}
              </div>
            </div>

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
    </>
  );
}
