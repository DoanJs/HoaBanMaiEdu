import { serverTimestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { addDocData } from "../../constants/firebase/addDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { useUserStore } from "../../zustand";
import LoadingOverlay from "../../components/LoadingOverLay";

export default function AdminField() {
  const { user } = useUserStore();
  const [keyword, setKeyword] = useState("");
  const [fieldEdit, setFieldEdit] = useState<any>();
  const [fields, setFields] = useState<any[]>([]);
  const [fieldName, setFieldName] = useState("");
  const isDisabled = !fieldName.trim();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getDocsData({
        nameCollect: "fields",
        setData: setFields,
      });
    }
  }, [user]);

  useEffect(() => {
    if (fieldEdit) {
      setFieldName(fieldEdit.name);
    }
  }, [fieldEdit]);

  // 🔎 FILTER
  const filteredFields = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return fields.filter((item) => {
      const content = `
        ${item.id ?? ""}
        ${item.name ?? ""}
      `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [fields, keyword]);

  // create new
  const handleCreateNew = () => {
    setFieldEdit(undefined);
    setFieldName("");
  };

  // add/update
  const handleField = async () => {
    const data = { name: fieldName };
    setIsLoading(true);
    if (fieldEdit) {
      updateDocData({
        nameCollect: "fields",
        id: fieldEdit.id,
        valueUpdate: {
          ...data,
          updateAt: serverTimestamp(),
        },
        metaDoc: "fields",
      })
        .then((result) => {
          // cập nhật UI ngay
          setFields((prev) =>
            prev.map((field) =>
              field.id === fieldEdit.id
                ? {
                    ...field,
                    ...data,
                    updateAt: new Date(),
                  }
                : field,
            ),
          );

          setIsLoading(false);
          setFieldEdit(undefined);
          handleToastSuccess(
            `Chỉnh sửa lĩnh vực thành công ! (${fieldEdit.id}) `,
          );
        })
        .catch((error) => {
          setIsLoading(false);
          handleToastError("Chỉnh sửa lĩnh vực thất bại !");
        });
    } else {
      addDocData({
        nameCollect: "fields",
        value: {
          ...data,

          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "fields",
      })
        .then((result) => {
          setFields((prev) => [
            ...prev,
            {
              ...data,
              id: result.id,
              createAt: new Date(),
              updateAt: new Date(),
            },
          ]);

          setIsLoading(false);
          setFieldEdit(undefined);
          handleToastSuccess(`Thêm lĩnh vực mới thành công ! (${result.id}) `);
        })
        .catch((eror) => {
          setIsLoading(false);
          handleToastError("Thêm lĩnh vực mới thất bại !");
        });
    }

    setFieldName("");
  };

  return (
    <>
      <div className="admin-target-page">
        <div className="row g-3 g-xl-4 admin-content">
          {/* TABLE */}
          <div className="col-12 col-xl-8 admin-table-col">
            <div className="page-panel p-3 p-md-4 h-100 d-flex flex-column">
              {/* SEARCH + COUNT */}
              <div className="search-box mb-3 d-flex align-items-center justify-content-between">
                <div className="search-left d-flex align-items-center">
                  <i className="bi bi-search me-2 text-muted" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="form-control search-input"
                    placeholder="Nhập tên lĩnh vực, mã lĩnh vực"
                  />
                </div>

                <div className="child-count">
                  Có {filteredFields.length} lĩnh vực
                </div>
              </div>

              {/* TABLE */}
              <div className="table-responsive">
                {filteredFields.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-search empty-icon"></i>
                    <div className="empty-text">
                      Không tìm thấy lĩnh vực phù hợp.
                    </div>
                  </div>
                ) : (
                  <table className="table plans-table align-middle">
                    <thead>
                      <tr>
                        <th>Tên lĩnh vực</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredFields.map((field) => (
                        <tr key={field.id}>
                          <td>
                            <div>{field.name}</div>
                            <b>{field.id}</b>
                          </td>
                          <td>
                            <button
                              className="icon-btn icon-edit"
                              onClick={() => setFieldEdit(field)}
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
            <div className="page-panel p-3 p-md-4 position-relative h-100">
              {/* DELETE */}
              {/* {fieldEdit && (
              <button
                className="icon-btn icon-delete position-absolute"
                style={{ top: 12, left: 12 }}
                onClick={handleDeleteField}
              >
                <i className="bi bi-trash"></i>
              </button>
            )} */}

              {/* ADD NEW */}
              {fieldEdit && (
                <button
                  className="icon-btn icon-add position-absolute"
                  style={{ top: 12, right: 12 }}
                  onClick={handleCreateNew}
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              )}

              <h4 className="text-center fw-bold mb-3">
                {fieldEdit ? "Chỉnh sửa lĩnh vực" : "Thêm lĩnh vực mới"}
              </h4>

              <input
                className="form-control mb-2"
                placeholder="Tên lĩnh vực"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
              />

              <button
                className="btn action-btn-primary w-100"
                disabled={isDisabled}
                onClick={handleField}
              >
                {fieldEdit ? "Cập nhật" : "Đăng ký"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay show={isLoading} />
    </>
  );
}
