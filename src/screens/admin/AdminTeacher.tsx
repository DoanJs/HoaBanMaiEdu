import { serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useMemo, useState } from "react";
import LoadingOverlay from "../../components/LoadingOverLay";
import { addDocData } from "../../constants/firebase/addDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { functions } from "../../firebase.config";
import { useUserStore } from "../../zustand";

export default function AdminTeacher() {
  const { user } = useUserStore();

  const [teacherEdit, setTeacherEdit] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const [form, setForm] = useState({
    id: "",
    fullName: "",
    avatar: "",
    email: "",
    position: "",
    role: "",
    telegramChatId: "",
  });

  useEffect(() => {
    if (user) {
      getDocsData({
        nameCollect: "users",
        setData: setTeachers,
      });
    }
  }, [user]);

  const filteredTeachers = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return teachers.filter((item) => {
      const content = `
        ${item.id ?? ""}
        ${item.fullName ?? ""}
        ${item.position ?? ""}
        ${item.role ?? ""}
      `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [teachers, keyword]);

  const isDisabled =
    !form.fullName.trim() || !form.email.trim() || !form.position || !form.role;

  useEffect(() => {
    if (teacherEdit) {
      setForm({
        id: teacherEdit.id || "",
        fullName: teacherEdit.fullName || "",
        avatar: teacherEdit.avatar || "",
        email: teacherEdit.email || "",
        position: teacherEdit.position || "",
        role: teacherEdit.role || "",
        telegramChatId: teacherEdit.telegramChatId || "",
      });
    }
  }, [teacherEdit]);

  const handleCreateNew = () => {
    setTeacherEdit(undefined);
    setForm({
      id: "",
      fullName: "",
      avatar: "",
      email: "",
      position: "",
      role: "",
      telegramChatId: "",
    });
  };

  const handleTeacher = async () => {
    const data = {
      fullName: form.fullName,
      avatar: form.avatar,
      email: form.email,
      position: form.position,
      role: form.role,
      telegramChatId: "",
      shortName: "",
      phone: "",
      birth: "",
      id: form.id,
    };

    setIsLoading(true);

    if (teacherEdit) {
      updateDocData({
        nameCollect: "users",
        id: teacherEdit.id,
        valueUpdate: {
          ...data,
          updateAt: serverTimestamp(),
        },
        metaDoc: "users",
      })
        .then(() => {
          setTeachers((prev) =>
            prev.map((teacher) =>
              teacher.id === teacherEdit.id
                ? {
                    ...teacher,
                    ...data,
                    updateAt: new Date(),
                  }
                : teacher,
            ),
          );

          handleToastSuccess(
            `Chỉnh sửa giáo viên thành công! (${teacherEdit.fullName || teacherEdit.name})`,
          );

          handleCreateNew();
        })
        .catch(() => {
          handleToastError("Chỉnh sửa giáo viên thất bại!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      addDocData({
        nameCollect: "users",
        value: {
          ...data,
          telegramChatId: "",
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "users",
        customId: data.id,
      })
        .then((result) => {
          setTeachers((prev) => [
            ...prev,
            {
              ...data,
              id: form.id,
              telegramChatId: "",
              createAt: new Date(),
              updateAt: new Date(),
            },
          ]);

          handleToastSuccess(`Thêm giáo viên mới thành công! (${result.id})`);
          handleCreateNew();
        })
        .catch(() => {
          handleToastError("Thêm giáo viên mới thất bại!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  // XÓA GIÁO VIÊN
  // const handleDeleteTeacher = async () => {
  //   if (!teacherEdit) return;

  //   setShowDelete(false);
  //   try {
  //     setIsLoading(true);

  //     const deleteTeacherDeep = httpsCallable<
  //       { teacherId: string },
  //       {
  //         ok: boolean;
  //         removedTeacherId: string;
  //         affectedDocs: number;
  //       }
  //     >(functions, "deleteTeacherDeep");

  //     const res = await deleteTeacherDeep({ teacherId: teacherEdit.id });

  //     // ✅ cập nhật UI ngay
  //     setTeachers((prev) =>
  //       prev.filter((teacher) => teacher.id !== teacherEdit.id),
  //     );

  //     // reset form
  //     handleCreateNew();

  //     handleToastSuccess(
  //       `Xóa giáo viên thành công! Đã xóa ${res.data.affectedDocs} mục có liên quan.`,
  //     );
  //   } catch (err: any) {
  //     console.error(err);

  //     if (err.code === "permission-denied") {
  //       handleToastError("Chỉ admin mới có quyền xóa giáo viên");
  //     } else if (err.code === "not-found") {
  //       handleToastError("Không tìm thấy giáo viên");
  //     } else {
  //       handleToastError("Xóa giáo viên thất bại");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleDeleteTeacher = async () => {
    if (!teacherEdit) return;

    setShowDelete(false);
    setIsLoading(true);

    try {
      const deleteTeacherDeep = httpsCallable<
        { teacherId: string },
        {
          ok: boolean;
          deletedTeacherId: string;
          updatedCount: number;
          synced: {
            children?: { removedTeacherIds: number };
            carts?: { removedTeacherIds: number; clearedAuthorId: number };
            plans?: { removedTeacherIds: number; clearedAuthorId: number };
            planTasks?: { removedTeacherIds: number; clearedAuthorId: number };
            reports?: { removedTeacherIds: number; clearedAuthorId: number };
            reportTasks?: {
              removedTeacherIds: number;
              clearedAuthorId: number;
            };
            reportSaveds?: {
              removedTeacherIds: number;
              clearedAuthorId: number;
            };
          };
        }
      >(functions, "deleteTeacherDeep");

      const res = await deleteTeacherDeep({
        teacherId: teacherEdit.id,
      });

      setTeachers((prev) =>
        prev.filter((teacher) => teacher.id !== teacherEdit.id),
      );

      handleCreateNew();

      handleToastSuccess(
        `Xóa giáo viên thành công! Đã cập nhật ${res.data.updatedCount} mục liên quan.`,
      );

      console.log("Chi tiết dữ liệu đã cập nhật:", res.data.synced);
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Chỉ admin mới có quyền xóa giáo viên");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy giáo viên");
      } else if (err.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập lại");
      } else {
        handleToastError("Xóa giáo viên thất bại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="admin-target-page">
        <div className="row g-3 g-xl-4 admin-content">
          {/* TABLE */}
          <div className="col-12 col-xl-8 admin-table-col">
            <div className="page-panel p-3 p-md-4 h-100 d-flex flex-column">
              <div className="search-box mb-3 d-flex align-items-center justify-content-between">
                <div className="search-left d-flex align-items-center">
                  <i className="bi bi-search me-2 text-muted" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="form-control search-input"
                    placeholder="Nhập tên giáo viên, quyền hạn"
                  />
                </div>

                <div className="child-count">
                  Có {filteredTeachers.length} giáo viên
                </div>
              </div>

              <div className="table-responsive">
                {filteredTeachers.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-search empty-icon"></i>
                    <div className="empty-text">
                      Không tìm thấy giáo viên phù hợp.
                    </div>
                  </div>
                ) : (
                  <table className="table plans-table align-middle">
                    <thead>
                      <tr>
                        <th>Tên giáo viên</th>
                        <th>Quyền</th>
                        <th>Handle</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTeachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td>
                            <div>{teacher.fullName}</div>
                            <b>{teacher.id}</b>
                          </td>

                          <td>{teacher.role}</td>

                          <td>
                            <button
                              className="icon-btn icon-edit"
                              onClick={() => setTeacherEdit(teacher)}
                            >
                              <i className="bi bi-pencil-fill"></i>
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

          {/* FORM */}
          <div className="col-12 col-xl-4 admin-form-col">
            <div className="page-panel qx-add-child-panel p-3 p-md-4 position-relative h-100">
              {teacherEdit && (
                <button
                  className="icon-btn icon-delete position-absolute"
                  style={{ top: 12, left: 12 }}
                  onClick={() => setShowDelete(true)}
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              )}
              {teacherEdit && (
                <button
                  className="icon-btn icon-add position-absolute"
                  style={{ top: 12, right: 12 }}
                  onClick={handleCreateNew}
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              )}

              <h4 className="text-center fw-bold mb-3">
                {teacherEdit ? "Chỉnh sửa giáo viên" : "Thêm giáo viên"}
              </h4>

              <label className="form-label">ID giáo viên:</label>
              <input
                disabled={teacherEdit}
                className="form-control mb-2"
                placeholder="Liên hệ admin để lấy ID giáo viên"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
              />
              <label className="form-label">Họ và tên:</label>
              <input
                className="form-control mb-2"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />

              <label className="form-label">Avatar:</label>
              <input
                className="form-control mb-2"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              />

              <label className="form-label">Email:</label>
              <input
                className="form-control mb-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={teacherEdit}
              />

              <label className="form-label">Vị trí:</label>
              <select
                className="form-select mb-2"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              >
                <option value="">Chọn</option>
                <option value="Giám đốc">Giám đốc</option>
                <option value="Phó Giám đốc">Phó Giám đốc</option>
                <option value="Chuyên viên Tâm lý">Chuyên viên Tâm lý</option>
              </select>

              <label className="form-label">Quyền:</label>
              <select
                className="form-select mb-3"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="">Chọn</option>
                <option value="teacher">teacher</option>
                <option value="admin">admin</option>
              </select>

              <label className="form-label">TelegramChatId:</label>
              <input
                className="form-control mb-2"
                value={form.telegramChatId}
                onChange={(e) =>
                  setForm({ ...form, telegramChatId: e.target.value })
                }
              />

              <button
                className="btn action-btn-primary w-100"
                disabled={isDisabled || isLoading}
                onClick={handleTeacher}
              >
                {teacherEdit ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay show={isLoading} />

      {showDelete && teacherEdit && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h5 className="fw-black text-danger mb-2">
              Xác nhận xoá giáo viên
            </h5>

            <p className="text-green-muted small">
              Hành động này sẽ xoá toàn bộ nội dung liên quan đến giáo viên và không thể khôi
              phục.
            </p>

            <div className="plan-delete-box mt-2">
              <div className="small">
                <strong>Tên giáo viên:</strong> {teacherEdit.fullName}
              </div>
              <div className="small">
                <strong>Mã giáo viên:</strong> {teacherEdit.id}
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
                onClick={handleDeleteTeacher}
              >
                <i className="bi bi-trash me-2" />
                Xoá giáo viên
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
