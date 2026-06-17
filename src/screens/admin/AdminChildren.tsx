import { serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useMemo, useState } from "react";
import Select, { MultiValue } from "react-select";
import LoadingOverlay from "../../components/LoadingOverLay";
import { addDocData } from "../../constants/firebase/addDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { functions } from "../../firebase.config";
import { ChildrenModel, UserModel } from "../../models";
import { useUserStore } from "../../zustand";
import "./adminchildren.css";
import { uploadChildAvatar } from "../../constants/uploadAvatar";

interface OptionType {
  id: string;
  fullName: string;
}

export default function AdminChildren() {
  const { user } = useUserStore();
  const [teachers, setTeachers] = useState<UserModel[]>([]);
  const [children, setChildren] = useState<ChildrenModel[]>([]);
  const [newChildren, setNewChildren] = useState<any[]>([]);
  const [childEdit, setChildEdit] = useState<ChildrenModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [selectTeachers, setSelectTeachers] = useState<OptionType[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    shortName: "",
    birth: "",
    gender: "",
    status: "studying", //studying || paused , còn xóa luôn thì k cần
  });
  const [keyword, setKeyword] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) {
      getDocsData({
        nameCollect: "users",
        setData: setTeachers,
      });
      getDocsData({
        nameCollect: "children",
        setData: setChildren,
      });
    }
  }, [user]);
  useEffect(() => {
    if (childEdit) {
      setForm({
        fullName: childEdit.fullName,
        status: childEdit.status || "studying",
        shortName: childEdit.shortName,
        birth: childEdit.birth,
        gender: childEdit.gender,
      });
      setAvatarPreview(childEdit.avatar);
      setSelectTeachers(
        childEdit.teacherIds.map((_) => {
          const indexTeacher = teachers.findIndex(
            (teacher) => teacher.id === _,
          );
          return { id: _, fullName: teachers[indexTeacher].fullName };
        }),
      );
    }
  }, [childEdit]);
  useEffect(() => {
    if (form.fullName && selectTeachers.length > 0) {
      ///chổ này thời gian sau nếu trẻ đồng bộ được status thì fix lại
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [form, selectTeachers]);
  useEffect(() => {
    if (children.length > 0) {
      setNewChildren(children);
    }
  }, [children]);

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t.fullName;
    });
    return map;
  }, [teachers]);

  const filteredChildren = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return newChildren.filter((child: ChildrenModel) => {
      const teacherNames = (child.teacherIds || [])
        .map((id: string) => teacherMap[id] || "")
        .join(" ");

      const content = `
      ${child.fullName ?? ""}
      ${child.id ?? ""}
      ${teacherNames}
    `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [newChildren, keyword, teacherMap]);

  // const handleChild = async () => {
  //   const data = {
  //     fullName: form.fullName,
  //     avatar: form.avatar,
  //     status: form.status,
  //     teacherIds: selectTeachers.map((item) => item.id),
  //   };

  //   setIsLoading(true);

  //   if (childEdit) {
  //     updateDocData({
  //       nameCollect: "children",
  //       id: childEdit.id,
  //       valueUpdate: {
  //         ...data,
  //         updateAt: serverTimestamp(),
  //       },
  //       metaDoc: "children",
  //     })
  //       .then(() => {
  //         // cập nhật UI ngay
  //         setNewChildren((prev) =>
  //           prev.map((child) =>
  //             child.id === childEdit.id
  //               ? {
  //                   ...child,
  //                   ...data,
  //                   updateAt: new Date(),
  //                 }
  //               : child,
  //           ),
  //         );

  //         setIsLoading(false);
  //         setForm({ fullName: "", avatar: "", status: "" });
  //         setSelectTeachers([]);
  //         setChildEdit(undefined);

  //         handleToastSuccess(
  //           `Chỉnh sửa thông tin trẻ thành công ! (${childEdit.fullName})`,
  //         );
  //       })
  //       .catch(() => {
  //         setIsLoading(false);
  //         handleToastError("Chỉnh sửa thông tin trẻ thất bại !");
  //       });
  //   } else {
  //     addDocData({
  //       nameCollect: "children",
  //       value: {
  //         ...data,
  //         createAt: serverTimestamp(),
  //         updateAt: serverTimestamp(),
  //       },
  //       metaDoc: "children",
  //     })
  //       .then((result) => {
  //         // thêm UI ngay
  //         setNewChildren((prev) => [
  //           ...prev,
  //           {
  //             ...data,
  //             id: result.id,
  //             createAt: new Date(),
  //             updateAt: new Date(),
  //           },
  //         ]);

  //         setIsLoading(false);
  //         setForm({ fullName: "", avatar: "", status: "" });
  //         setSelectTeachers([]);

  //         handleToastSuccess(`Thêm trẻ mới thành công ! (${result.id})`);
  //       })
  //       .catch(() => {
  //         setIsLoading(false);
  //         handleToastError("Thêm trẻ mới thất bại !");
  //       });
  //   }
  // };
  const handleChild = async () => {
    const teacherIds = selectTeachers.map((item) => item.id);

    const data = {
      fullName: form.fullName,
      avatar: avatarPreview || "/HBMEdu-icon-512x512.png",
      status: form.status,
      shortName: form.shortName,
      birth: form.birth,
      gender: form.gender,
      teacherIds,
    };

    setIsLoading(true);

    try {
      // ✅ CẬP NHẬT TRẺ: dùng Cloud Function
      if (childEdit) {
        let avatar = data.avatar;

        if (avatarFile) {
          const resultAvatar = await uploadChildAvatar(
            avatarFile,
            childEdit.id,
          );

          avatar = resultAvatar.avatar;
        }

        const res = await httpsCallable<
          {
            childId: string;
            fullName: string;
            avatar: string;
            status: string;
            shortName: string;
            birth: string;
            gender: string;
            teacherIds: string[];
          },
          {
            ok: boolean;
            childId: string;
            teacherChanged: boolean;
            updatedCount: number;
          }
        >(
          functions,
          "updateChild",
        )({
          childId: childEdit.id,
          ...data,
          avatar,
        });

        setNewChildren((prev) =>
          prev.map((child) =>
            child.id === childEdit.id
              ? {
                  ...child,
                  ...data,
                  updateAt: new Date(),
                }
              : child,
          ),
        );

        handleToastSuccess(
          res.data.teacherChanged
            ? `Cập nhật trẻ thành công! Đã đồng bộ ${res.data.updatedCount} mục liên quan.`
            : `Cập nhật trẻ thành công!`,
        );
      }

      // ✅ TẠO MỚI TRẺ: vẫn dùng client
      else {
        const result = await addDocData({
          nameCollect: "children",
          value: {
            ...data,
            avatar: "",
            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          },
          metaDoc: "children",
        });

        let avatar = "";

        if (avatarFile) {
          const resultAvatar = await uploadChildAvatar(avatarFile, result.id);
          avatar = resultAvatar?.avatar || "";
        }

        setNewChildren((prev) => [
          ...prev,
          {
            ...data,
            id: result.id,
            avatar,
            createAt: new Date(),
            updateAt: new Date(),
          },
        ]);

        handleToastSuccess(`Thêm trẻ mới thành công!`);
      }

      handleCreateNew();
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Chỉ admin mới có quyền cập nhật trẻ");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy trẻ");
      } else {
        handleToastError(
          childEdit ? "Cập nhật trẻ thất bại" : "Thêm trẻ mới thất bại",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Reset form (TẠO MỚI)
  const handleCreateNew = () => {
    setForm({
      fullName: "",
      status: "",
      shortName: "",
      birth: "",
      gender: "",
    });
    setSelectTeachers([]);
    setChildEdit(undefined);
    setAvatarPreview("");
    setAvatarFile(null);
  };

  // XÓA trẻ
  // const handleDeleteChild = async () => {
  //   if (!childEdit) return;

  //   setShowDelete(false);
  //   try {
  //     setIsLoading(true);

  //     const deleteChildDeep = httpsCallable<
  //       { childId: string },
  //       {
  //         ok: boolean;
  //         deletedChildId: string;
  //         deletedPlansCount: number;
  //         deletedReportsCount: number;
  //       }
  //     >(functions, "deleteChildDeep");

  //     const res = await deleteChildDeep({ childId: childEdit.id });

  //     // ✅ cập nhật UI ngay
  //     setNewChildren((prev) =>
  //       prev.filter((child) => child.id !== childEdit.id),
  //     );

  //     // reset form
  //     setChildEdit(undefined);
  //     setForm({ fullName: "", avatar: "", status: "" });
  //     setSelectTeachers([]);

  //     handleToastSuccess(
  //       `Xóa trẻ thành công! Đã xóa ${res.data.deletedPlansCount} kế hoạch và ${res.data.deletedReportsCount} báo cáo.`,
  //     );
  //   } catch (err: any) {
  //     console.error(err);

  //     if (err.code === "permission-denied") {
  //       handleToastError("Chỉ admin mới có quyền xóa trẻ");
  //     } else if (err.code === "not-found") {
  //       handleToastError("Không tìm thấy trẻ");
  //     } else {
  //       handleToastError("Xóa trẻ thất bại");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleDeleteChild = async () => {
    if (!childEdit) return;

    setShowDelete(false);
    setIsLoading(true);

    try {
      const deleteChildDeep = httpsCallable<
        { childId: string },
        {
          ok: boolean;
          deletedChildId: string;
          deleted: {
            carts: number;
            plans: number;
            planTasks: number;
            reports: number;
            reportTasks: number;
            reportSaveds: number;
          };
          deletedPlansCount: number;
          deletedReportsCount: number;
        }
      >(functions, "deleteChildDeep");

      const res = await deleteChildDeep({
        childId: childEdit.id,
      });

      setNewChildren((prev) =>
        prev.filter((child) => child.id !== childEdit.id),
      );

      setChildEdit(undefined);
      setForm({
        fullName: "",
        status: "",
        shortName: "",
        birth: "",
        gender: "",
      });
      setSelectTeachers([]);

      const deleted = res.data.deleted;

      handleToastSuccess(
        `Xóa trẻ thành công! Đã xóa 
        ${deleted.plans} kế hoạch, 
        ${deleted.planTasks} chi tiết kế hoạch, 
        ${deleted.reports} báo cáo, 
        ${deleted.reportTasks} chi tiết báo cáo, 
        ${deleted.carts} giỏ nháp, 
        ${deleted.reportSaveds} chi tiết báo cáo nháp`,
      );

      // console.log("Chi tiết dữ liệu đã xóa:", {
      //   carts: deleted.carts,
      //   plans: deleted.plans,
      //   planTasks: deleted.planTasks,
      //   reports: deleted.reports,
      //   reportTasks: deleted.reportTasks,
      //   reportSaveds: deleted.reportSaveds,
      // });
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Chỉ admin mới có quyền xóa trẻ");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy trẻ");
      } else if (err.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập lại");
      } else {
        handleToastError("Xóa trẻ thất bại");
      }
    } finally {
      setIsLoading(false);
      handleCreateNew();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <>
      <div className="row g-3 g-xl-4">
        {/* TABLE */}
        <div className="col-12 col-xl-8">
          <div className="page-panel p-3 p-md-4 h-100">
            <div className="search-box mb-3 d-flex align-items-center justify-content-between">
              <div className="search-left d-flex align-items-center">
                <i className="bi bi-search me-2 text-muted" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="form-control search-input"
                  placeholder="Nhập tên trẻ, giáo viên phụ trách..."
                />
              </div>

              <div className="child-count">
                Có {filteredChildren.length} trẻ
              </div>
            </div>

            <div className="table-responsive">
              {filteredChildren.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-search empty-icon"></i>
                  <div className="empty-text">Không tìm thấy trẻ phù hợp.</div>
                </div>
              ) : (
                <table className="table plans-table align-middle">
                  <thead>
                    <tr>
                      <th>Tên trẻ</th>
                      <th>Giáo viên phụ trách</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredChildren.map((child) => (
                      <tr key={child.id}>
                        <td>
                          <b>{child.fullName}</b>
                          <div className="small text-muted">{child.id}</div>
                        </td>

                        <td>
                          <div className="d-flex flex-column gap-1">
                            {(child.teacherIds || [])
                              .map((id: string) => teacherMap[id])
                              .filter(Boolean)
                              .map((name: string, index: number) => (
                                <span key={index} className="teacher-badge">
                                  {name}
                                </span>
                              ))}
                          </div>
                        </td>

                        <td>
                          <button
                            className="icon-btn icon-edit"
                            onClick={() => setChildEdit(child)}
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
        <div className="col-12 col-xl-4">
          <div className="page-panel qx-add-child-panel p-3 p-md-4 position-relative">
            {/* ICON XÓA */}
            {childEdit && (
              <button
                className="icon-btn icon-delete position-absolute"
                style={{ top: 12, left: 12 }}
                onClick={() => setShowDelete(true)}
              >
                <i className="bi bi-trash-fill"></i>
              </button>
            )}

            {/* ICON TẠO MỚI */}
            {childEdit && (
              <button
                className="icon-btn icon-add position-absolute"
                style={{ top: 12, right: 12 }}
                onClick={handleCreateNew}
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            )}

            <h4 className="text-center fw-bold mb-3">
              {childEdit ? "Chỉnh sửa thông tin trẻ" : "Thêm trẻ mới"}
            </h4>

            <input
              className="form-control mb-2"
              placeholder="Tên trẻ"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Bí danh"
              value={form.shortName}
              onChange={(e) => setForm({ ...form, shortName: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Ngày sinh"
              value={form.birth}
              onChange={(e) => setForm({ ...form, birth: e.target.value })}
            />
            <select
              className="form-control mb-2"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            {/* <input
              className="form-control mb-2"
              placeholder="Avatar"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            /> */}

            <span>Ảnh đại diện:</span>
            <div className="text-center d-flex align-items-center justify-content-center mb-2">
              <img
                src={avatarPreview || "/HBMEdu-icon-512x512.png"}
                className="admin-child-avatar me-3"
                alt="avatar"
              />

              <input
                type="file"
                id="childAvatar"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <label htmlFor="childAvatar" className="btn btn-light mt-2">
                <i className="bi bi-camera me-2"></i>
                Đổi ảnh
              </label>
            </div>

            <Select
              className="mb-2"
              getOptionLabel={(option) => option.fullName}
              getOptionValue={(option) => option.id.toString()}
              isMulti
              options={teachers}
              value={selectTeachers}
              onChange={(value: MultiValue<OptionType>) => {
                setSelectTeachers(value as OptionType[]);
              }}
            />

            <select
              className="form-select mb-3"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value={"studying"}>Đang học</option>
              <option value={"paused"}>Tạm dừng</option>
            </select>

            <button
              className="btn action-btn-primary w-100"
              onClick={disable ? undefined : handleChild}
              disabled={disable}
            >
              {childEdit ? "Cập nhật" : "Đăng ký"}
            </button>
          </div>
        </div>
      </div>

      <LoadingOverlay show={isLoading} />

      {showDelete && childEdit && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            {/* Title */}
            <h5 className="fw-black text-danger mb-2">Xác nhận xoá trẻ</h5>

            {/* Description */}
            <p className="text-green-muted small">
              Hành động này sẽ xoá toàn bộ nội dung liên quan đến trẻ và không
              thể khôi phục.
            </p>

            {/* Plan info */}
            <div className="plan-delete-box mt-2">
              <div className="small">
                <strong>Tên trẻ:</strong> {childEdit.fullName}
              </div>
              <div className="small">
                <strong>Mã trẻ:</strong> {childEdit.id}
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
                onClick={handleDeleteChild}
              >
                <i className="bi bi-trash me-2" />
                Xoá trẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
