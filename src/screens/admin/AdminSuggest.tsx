import { AddCircle, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import {
  ModalDeleteComponent,
  RowComponent,
  SearchComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import { colors } from "../../constants/colors";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { FieldModel, TargetModel } from "../../models";
import { SuggestModel } from "../../models/SuggestModel";
import { useUserStore } from "../../zustand";
import AdminSuggestComponent from "./AdminSuggestComponent";
import { addDocData } from "../../constants/firebase/addDocData";
import { serverTimestamp } from "firebase/firestore";

export default function AdminSuggest() {
  const { user } = useUserStore();
  const [targetEdit, setTargetEdit] = useState<TargetModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);

  const [fields, setFields] = useState<FieldModel[]>([]);
  const [form, setForm] = useState({
    nameSuggest: "",
    fieldId: "",
  });

  const [suggests, setSuggests] = useState<SuggestModel[]>([]);
  const [newSuggests, setNewSuggests] = useState<any[]>([]);
  const [suggestEdit, setSuggestEdit] = useState<SuggestModel>();

  useEffect(() => {
    if (suggestEdit) {
      setForm({
        fieldId: suggestEdit.fieldId,
        nameSuggest: suggestEdit.name,
      });
    }
  }, [suggestEdit]);

  useEffect(() => {
    if (form.fieldId && form.nameSuggest) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [form]);

  useEffect(() => {
    if (user) {
      getDocsData({
        nameCollect: "suggests",
        setData: setSuggests,
      });
      getDocsData({
        nameCollect: "fields",
        setData: setFields,
      });
    }
  }, [user]);

  useEffect(() => {
    if (suggests.length > 0) {
      setNewSuggests(suggests);
    }
  }, [suggests]);

  const handleSuggest = async () => {
    setIsLoading(true);
    if (suggestEdit) {
      updateDocData({
        nameCollect: "suggests",
        id: suggestEdit.id,
        valueUpdate: {
          fieldId: form.fieldId,
          name: form.nameSuggest,
        },
        metaDoc: "suggests",
      })
        .then((result) => {
          setIsLoading(false);
          handleToastSuccess(
            `Chỉnh sửa gợi ý thành công ! (${suggestEdit.id}) `
          );
        })
        .catch((error) => {
          setIsLoading(false);
          handleToastError("Chỉnh sửa gợi ý thất bại !");
        });
    } else {
      addDocData({
        nameCollect: "suggests",
        value: {
          name: form.nameSuggest,
          fieldId: form.fieldId,

          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "suggests",
      })
        .then((result) => {
          setNewSuggests([
            ...newSuggests,
            {
              id: result.id,
              name: form.nameSuggest,
              fieldId: form.fieldId,
              createAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            },
          ]);
          setIsLoading(false);
          handleToastSuccess(`Thêm gợi ý mới thành công ! (${result.id}) `);
        })
        .catch((eror) => {
          setIsLoading(false);
          handleToastError("Thêm gợi ý mới thất bại !");
        });
    }
    setForm({ nameSuggest: "", fieldId: "" });
  };

  return (
    <RowComponent
      styles={{
        alignItems: "flex-start",
        height: widthSmall ? "85%" : "90%",
      }}
    >
      <div
        style={{ flex: 2, height: "100%", overflowY: "scroll", padding: 16 }}
      >
        <RowComponent justify="space-between">
          <SearchComponent
            title="Tìm gợi ý"
            placeholder="Nhập gợi ý"
            width={"75%"}
            arrSource={suggests}
            type="searchSuggest"
            onChange={(val) => setNewSuggests(val)}
          />
          <TextComponent
            text={`Có ${newSuggests.length} gợi ý`}
            styles={{ fontWeight: "bold" }}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <table
          className="table table-bordered"
          style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
        >
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">Tên gợi ý</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {newSuggests.length > 0 &&
              newSuggests.map((suggest, index) => (
                <AdminSuggestComponent
                  key={index}
                  suggest={suggest}
                  fields={fields}
                  setSuggestEdit={setSuggestEdit}
                />
              ))}
          </tbody>
        </table>
      </div>

      <SpaceComponent width={20} />

      <div
        style={{
          flex: 1,
          background: colors.primaryLight,
          padding: "6px 10px",
          borderRadius: 10,
          height: "100%",
          overflowY: "scroll",
          position: "relative",
        }}
      >
        {suggestEdit && (
          <>
            <AddCircle
              size={widthSmall ? sizes.thinTitle : sizes.title}
              color="coral"
              variant="Bold"
              style={{
                cursor: "pointer",
                position: "absolute",
                top: 10,
                right: 10,
              }}
              onClick={() => {
                setForm({
                  nameSuggest: "",
                  fieldId: "",
                });
                setSuggestEdit(undefined);
              }}
            />
            <Trash
              size={widthSmall ? sizes.thinTitle : sizes.title}
              color={colors.red}
              variant="Bold"
              style={{
                cursor: "pointer",
                position: "absolute",
                top: 10,
                left: 10,
              }}
              data-bs-dismiss="modal"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            />
          </>
        )}
        <RowComponent justify="center">
          <TextComponent
            text={suggestEdit ? "Chỉnh sửa gợi ý" : "Thêm gợi ý"}
            size={widthSmall ? sizes.bigText : sizes.title}
            styles={{ fontWeight: "bold" }}
          />
        </RowComponent>

        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Lĩnh vực:
          </label>
          <select
            value={form.fieldId}
            className={`form-select ${widthSmall && "form-select-sm"}`}
            aria-label="Default select example"
            onChange={(val) => setForm({ ...form, fieldId: val.target.value })}
          >
            <option defaultValue={""}>Chọn</option>
            {fields.length > 0 &&
              fields.map((_, index) => (
                <option key={index} value={_.id}>
                  {_.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Nội dung gợi ý:
          </label>
          <textarea
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
            value={form.nameSuggest}
            onChange={(e) => setForm({ ...form, nameSuggest: e.target.value })}
            className="form-control"
            placeholder="Nhập nội dung gợi ý"
            rows={6}
          ></textarea>
        </div>

        <SpaceComponent height={10} />
        <button
          style={{
            width: "100%",
            background: disable ? colors.gray : colors.orange,
            borderColor: disable ? colors.gray : colors.orange,
            fontWeight: "bold",
            fontSize: widthSmall ? sizes.text : sizes.bigText,
          }}
          type="button"
          className="btn btn-primary"
          onClick={disable ? undefined : handleSuggest}
        >
          {isLoading ? (
            <SpinnerComponent />
          ) : (
            <>{suggestEdit ? "Cập nhật" : "Thêm mới"}</>
          )}
        </button>
      </div>

      <LoadingOverlay show={isLoading} />

      <ModalDeleteComponent
        data={{
          id: suggestEdit?.id as string,
          nameCollect: "suggests",
          itemTasks: [],
          setForm: setForm,
          setEdit: setSuggestEdit
        }}
      />
    </RowComponent>
  );
}
