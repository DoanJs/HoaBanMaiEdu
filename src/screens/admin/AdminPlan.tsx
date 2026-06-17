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

export default function AdminPlan() {
  const { user } = useUserStore();

  const [plans, setPlans] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  const [planEdit, setPlanEdit] = useState<any>();
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
      getDocsData({
        nameCollect: "plans",
        setData: setPlans,
      });

      getDocsData({
        nameCollect: "children",
        setData: setChildren,
      });

      getDocsData({
        nameCollect: "users",
        setData: setTeachers,
      });
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

  const filteredPlans = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return plans.filter((item: any) => {
      const childName = childMap[item.childId] || "";

      const teacherNames = (item.teacherIds || [])
        .map((id: string) => teacherMap[id] || "")
        .join(" ");

      const content = `
        ${item.id ?? ""}
        ${item.title ?? ""}
        ${item.status ?? ""}
        ${childName}
        ${teacherNames}
      `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [plans, keyword, childMap, teacherMap]);

  useEffect(() => {
    if (!planEdit) return;

    setForm({
      title: planEdit.title || "",
      status: planEdit.status || "",
    });

    const selected = teachers.filter((t: any) =>
      (planEdit.teacherIds || []).includes(t.id),
    );

    setSelectTeachers(selected);
  }, [planEdit, teachers]);

  const handleCloseEdit = () => {
    setPlanEdit(undefined);
    setForm({
      title: "",
      status: "",
    });
    setSelectTeachers([]);
  };

  const isDisabled =
    !form.title.trim() || !form.status || selectTeachers.length === 0;

  const handleUpdatePlan = async () => {
    if (!planEdit) return;

    const data = {
      title: form.title,
      status: form.status,
    };

    setIsLoading(true);

    try {
      await updateDocData({
        nameCollect: "plans",
        id: planEdit.id,
        valueUpdate: {
          ...data,
          updateAt: serverTimestamp(),
        },
        metaDoc: "plans",
      });

      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === planEdit.id
            ? {
                ...plan,
                ...data,
                updateAt: new Date(),
              }
            : plan,
        ),
      );

      handleToastSuccess(`Cập nhật kế hoạch thành công! (${planEdit.id})`);
      handleCloseEdit();
    } catch (error) {
      console.error(error);
      handleToastError("Cập nhật kế hoạch thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleUpdatePlan = async () => {
  //   if (!planEdit) return;

  //   const data = {
  //     title: form.title,
  //     status: form.status,
  //     teacherIds: selectTeachers.map((t: any) => t.id),
  //   };

  //   setIsLoading(true);

  //   updateDocData({
  //     nameCollect: "plans",
  //     id: planEdit.id,
  //     valueUpdate: {
  //       ...data,
  //       updateAt: serverTimestamp(),
  //     },
  //     metaDoc: "plans",
  //   })
  //     .then(() => {
  //       setPlans((prev) =>
  //         prev.map((plan) =>
  //           plan.id === planEdit.id
  //             ? {
  //                 ...plan,
  //                 ...data,
  //                 updateAt: new Date(),
  //               }
  //             : plan,
  //         ),
  //       );

  //       handleToastSuccess(`Cập nhật kế hoạch thành công! (${planEdit.id})`);
  //       handleCloseEdit();
  //     })
  //     .catch(() => {
  //       handleToastError("Cập nhật kế hoạch thất bại!");
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  // XÓA KẾ HOẠCH

  // const handleDeletePlan = async () => {
  //   if (!planEdit) return;

  //   setShowDelete(false);
  //   try {
  //     setIsLoading(true);

  //     const deletePlanDeep = httpsCallable<
  //       { planId: string },
  //       {
  //         ok: boolean;
  //         deletedPlanId: string;
  //         deletedRelatedDocs: number;
  //       }
  //     >(functions, "deletePlanDeep");

  //     const res = await deletePlanDeep({ planId: planEdit.id });

  //     // ✅ cập nhật UI ngay
  //     setPlans((prev) => prev.filter((plan) => plan.id !== planEdit.id));

  //     // reset form
  //     handleCloseEdit();

  //     handleToastSuccess(
  //       `Xóa kế hoạch thành công! Đã xóa ${res.data.deletedRelatedDocs} mục có liên quan.`,
  //     );
  //   } catch (err: any) {
  //     console.error(err);

  //     if (err.code === "permission-denied") {
  //       handleToastError("Chỉ admin mới có quyền xóa kế hoạch");
  //     } else if (err.code === "not-found") {
  //       handleToastError("Không tìm thấy kế hoạch");
  //     } else {
  //       handleToastError("Xóa kế hoạch thất bại");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDeletePlan = async () => {
    if (!planEdit) return;

    setShowDelete(false);
    setIsLoading(true);

    try {
      const deletePlanCF = httpsCallable<
        { planId: string },
        {
          success: boolean;
          deleted: {
            planTasks: number;
            reports: number;
            reportTasks: number;
            reportSaveds: number;
          };
        }
      >(functions, "deletePlan");

      const res = await deletePlanCF({
        planId: planEdit.id,
      });

      const deleted = res.data.deleted;

      const totalDeleted =
        1 +
        deleted.planTasks +
        deleted.reports +
        deleted.reportTasks +
        deleted.reportSaveds;

      setPlans((prev) => prev.filter((plan) => plan.id !== planEdit.id));

      handleCloseEdit();

      handleToastSuccess(
        `Xóa kế hoạch thành công! Đã xóa ${totalDeleted} mục liên quan.`,
      );
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Bạn không có quyền xoá kế hoạch");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy kế hoạch");
      } else if (err.code === "functions/failed-precondition") {
        handleToastError("Chỉ được xoá kế hoạch đang pending");
      } else if (err.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập lại");
      } else {
        handleToastError("Xóa kế hoạch thất bại");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              planEdit
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
                    placeholder="Nhập kế hoạch"
                  />
                </div>

                <div className="child-count">
                  Có {filteredPlans.length} kế hoạch
                </div>
              </div>

              <div className="table-responsive">
                {filteredPlans.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-search empty-icon" />
                    <div className="empty-text">
                      Không tìm thấy kế hoạch phù hợp.
                    </div>
                  </div>
                ) : (
                  <table className="table plans-table align-middle">
                    <thead>
                      <tr>
                        <th>Tên trẻ</th>
                        <th>Kế hoạch</th>
                        <th>Trạng thái</th>
                        <th>Handle</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPlans.map((plan: any) => (
                        <tr key={plan.id}>
                          <td>{childMap[plan.childId] || "-"}</td>

                          <td>
                            {plan.title} - <b>{plan.id}</b>
                          </td>

                          <td>{plan.status}</td>

                          <td>
                            <button
                              className="icon-btn icon-edit"
                              onClick={() => {
                                setPlanEdit(plan);
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

          {planEdit && (
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

                <h4 className="text-center fw-bold mb-3">Chỉnh sửa kế hoạch</h4>

                <label className="form-label">Tên kế hoạch:</label>
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
                  onClick={handleUpdatePlan}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LoadingOverlay show={isLoading} />

      {showDelete && planEdit && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h5 className="fw-black text-danger mb-2">Xác nhận xoá kế hoạch</h5>

            <p className="text-green-muted small">
              Hành động này sẽ xoá toàn bộ nội dung kế hoạch và không thể khôi
              phục.
            </p>

            <div className="plan-delete-box mt-2">
              <div className="small">
                <strong>Tên kế hoạch:</strong> {planEdit.title}
              </div>
              <div className="small">
                <strong>Mã kế hoạch:</strong> {planEdit.id}
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
                onClick={handleDeletePlan}
              >
                <i className="bi bi-trash me-2" />
                Xoá kế hoạch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
