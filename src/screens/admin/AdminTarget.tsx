import { serverTimestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import LoadingOverlay from "../../components/LoadingOverLay";
import { addDocData } from "../../constants/firebase/addDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { FieldModel, TargetModel } from "../../models";
import { useUserStore } from "../../zustand";
import "./admintarget.css";

export default function AdminTarget() {
  const { user } = useUserStore();
  const [targetEdit, setTargetEdit] = useState<TargetModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [targets, setTargets] = useState<any[]>([]);
  const [fields, setFields] = useState<FieldModel[]>([]);
  const [keyword, setKeyword] = useState("");
  const [form, setForm] = useState({
    nameTarget: "",
    level: 0,
    fieldId: "",
    content: "",
  });

  useEffect(() => {
    if (user) {
      getDocsData({
        nameCollect: "targets",
        setData: setTargets,
      });
      getDocsData({
        nameCollect: "fields",
        setData: setFields,
      });
    }
  }, [user]);

  const isDisabled =
    !form.fieldId.trim() || !form.nameTarget?.trim() || !form.level;

  useEffect(() => {
    if (targetEdit) {
      setForm({
        nameTarget: targetEdit.name,
        fieldId: targetEdit.fieldId,
        level: targetEdit.level,
        content: targetEdit.content || "",
      });
    }
  }, [targetEdit]);

  const fieldMap = useMemo(() => {
    const map: any = {};
    fields.forEach((t) => {
      map[t.id] = t.name;
    });
    return map;
  }, [fields]);

  const filteredTargets = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return targets.filter((item) => {
      // lấy tên field từ fieldId
      const fieldName = fieldMap[item.fieldId] || "";

      const content = `
      ${item.id ?? ""}
      ${item.name ?? ""}
      ${fieldName}
      level: ${item.level ?? ""}
    `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [targets, keyword, fieldMap]);

  const handleCreateNew = () => {
    setTargetEdit(undefined);
    setForm({ nameTarget: "", level: 0, fieldId: "", content: "" });
  };
  const handleTarget = async () => {
    const data = {
      name: form.nameTarget,
      level: form.level,
      fieldId: form.fieldId,
      content: form.content,
    };

    setIsLoading(true);
    if (targetEdit) {
      updateDocData({
        nameCollect: "targets",
        id: targetEdit.id,
        valueUpdate: {
          ...data,
          updateAt: serverTimestamp(),
        },
        metaDoc: "targets",
      })
        .then((result) => {
          // cập nhật UI ngay
          setTargets((prev) =>
            prev.map((target) =>
              target.id === targetEdit.id
                ? {
                  ...target,
                  ...data,
                  updateAt: new Date(),
                }
                : target,
            ),
          );

          setIsLoading(false);
          setTargetEdit(undefined);
          handleToastSuccess(
            `Chỉnh sửa mục tiêu thành công ! (${targetEdit.id}) `,
          );
        })
        .catch((error) => {
          setIsLoading(false);
          handleToastError("Chỉnh sửa mục tiêu thất bại !");
        });
    } else {
      addDocData({
        nameCollect: "targets",
        value: {
          ...data,

          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "targets",
      })
        .then((result) => {
          setTargets((prev) => [
            ...prev,
            {
              ...data,
              id: result.id,
              createAt: new Date(),
              updateAt: new Date(),
            },
          ]);

          setIsLoading(false);
          handleToastSuccess(`Thêm mục tiêu mới thành công ! (${result.id}) `);
        })
        .catch((eror) => {
          setIsLoading(false);
          handleToastError("Thêm mục tiêu mới thất bại !");
        });
      //   if (form.nameSuggest) {
      //     addDocData({
      //       nameCollect: "suggests",
      //       value: {
      //         name: form.nameSuggest,
      //         fieldId: form.fieldId,

      //         createAt: serverTimestamp(),
      //         updateAt: serverTimestamp(),
      //       },
      //       metaDoc: "suggests",
      //     })
      //       .then((result) => {
      //         setIsLoading(false);
      //         handleToastSuccess(`Thêm gợi ý mới thành công ! (${result.id}) `);
      //       })
      //       .catch((eror) => {
      //         setIsLoading(false);
      //         handleToastError("Thêm gợi ý mới thất bại !");
      //       });
      //   }
    }

    setForm({ nameTarget: "", fieldId: "", level: 0, content: "" });
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
                    placeholder="Nhập mục tiêu, lĩnh vực, level: 2 ..."
                  />
                </div>

                <div className="child-count">
                  Có {filteredTargets.length} mục tiêu
                </div>
              </div>

              <div className="table-responsive">
                {filteredTargets.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-search empty-icon"></i>
                    <div className="empty-text">
                      Không tìm thấy mục tiêu phù hợp.
                    </div>
                  </div>
                ) : (
                  <table className="table plans-table align-middle">
                    <thead>
                      <tr>
                        <th>Tên mục tiêu</th>
                        <th>Level</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTargets.map((target) => (
                        <tr key={target.id}>
                          <td>
                            <div>{target.name}</div>
                            <button className={`btn add-goal-btn`}>
                              {fieldMap[target.fieldId]}
                            </button>
                            <b> {target.id}</b>
                          </td>

                          <td>{target.level}</td>

                          <td>
                            <button
                              className="icon-btn icon-edit"
                              onClick={() => setTargetEdit(target)}
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
              {/* {targetEdit && (
                <button
                  className="icon-btn icon-delete position-absolute"
                  style={{ top: 12, left: 12 }}
                  onClick={() => setShowDelete(true)}
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              )} */}

              {targetEdit && (
                <button
                  className="icon-btn icon-add position-absolute"
                  style={{ top: 12, right: 12 }}
                  onClick={handleCreateNew}
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              )}

              <h4 className="text-center fw-bold mb-3">
                {targetEdit ? "Chỉnh sửa mục tiêu" : "Thêm mục tiêu mới"}
              </h4>

              <label className="form-label">Lĩnh vực:</label>
              <select
                className="form-select mb-2"
                value={form.fieldId}
                onChange={(e) => setForm({ ...form, fieldId: e.target.value })}
              >
                <option defaultValue={""}>Chọn</option>
                {fields.length > 0 &&
                  fields.map((_, index) => (
                    <option key={index} value={_.id}>
                      {_.name}
                    </option>
                  ))}
              </select>

              <label className="form-label">Nội dung mục tiêu:</label>
              <textarea
                className="form-control mb-2"
                rows={6}
                value={form.nameTarget}
                onChange={(e) =>
                  setForm({ ...form, nameTarget: e.target.value })
                }
                placeholder="Nhập nội dung mục tiêu"
              />

              <label className="form-label">Level mục tiêu</label>
              <select
                className="form-select mb-2"
                value={form.level}
                onChange={(e) =>
                  setForm({ ...form, level: Number(e.target.value) })
                }
              >
                <option defaultValue={""}>Chọn</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>

              <label className="form-label">Gợi ý cho mục tiêu:</label>
              <textarea
                className="form-control mb-3"
                rows={6}
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                placeholder="Nhập nội dung gợi ý"
              />

              <button
                className="btn action-btn-primary w-100"
                disabled={isDisabled}
                onClick={handleTarget}
              >
                {targetEdit ? "Cập nhật" : "Đăng ký"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay show={isLoading} />
    </>
  );
}
