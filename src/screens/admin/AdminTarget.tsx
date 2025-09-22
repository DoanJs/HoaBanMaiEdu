import { serverTimestamp } from "firebase/firestore";
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
import { addDocData } from "../../constants/firebase/addDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { FieldModel, TargetModel } from "../../models";
import { useUserStore } from "../../zustand";
import AdminTargetComponent from "./AdminTargetComponent";
interface OptionType {
  id: string;
  fullName: string;
}

export default function AdminTarget() {
  const { user } = useUserStore();
  const [targetEdit, setTargetEdit] = useState<TargetModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);

  const [targets, setTargets] = useState<TargetModel[]>([]);
  const [newTargets, setNewTargets] = useState<any[]>([]);
  const [fields, setFields] = useState<FieldModel[]>([]);
  const [form, setForm] = useState({
    nameTarget: "",
    nameSuggest: "",
    level: 0,
    fieldId: "",
  });

  useEffect(() => {
    if (targetEdit) {
      setForm({
        nameTarget: targetEdit.name,
        fieldId: targetEdit.fieldId,
        nameSuggest: "",
        level: targetEdit.level,
      });
    }
  }, [targetEdit]);
  useEffect(() => {
    if (form.fieldId && ((form.nameTarget && form.level) || form.nameSuggest)) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [form]);

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

  useEffect(() => {
    if (targets.length > 0) {
      setNewTargets(targets);
    }
  }, [targets]);

  const handleTargetField = async () => {
    setIsLoading(true);
    if (targetEdit) {
      updateDocData({
        nameCollect: "targets",
        id: targetEdit.id,
        valueUpdate: {
          fieldId: form.fieldId,
          name: form.nameTarget,
          level: form.level,
        },
        metaDoc: "targets",
      })
        .then((result) => {
          setIsLoading(false);
          handleToastSuccess(
            `Chỉnh sửa mục tiêu thành công ! (${targetEdit.id}) `
          );
        })
        .catch((error) => {
          setIsLoading(false);
          handleToastError("Chỉnh sửa mục tiêu thất bại !");
        });
    } else {
      if (form.nameTarget && form.level) {
        addDocData({
          nameCollect: "targets",
          value: {
            name: form.nameTarget,
            fieldId: form.fieldId,
            level: form.level,

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          },
          metaDoc: "targets",
        })
          .then((result) => {
            setNewTargets([
              ...newTargets,
              {
                id: result.id,
                name: form.nameTarget,
                fieldId: form.fieldId,
                level: form.level,

                createAt: serverTimestamp(),
                updateAt: serverTimestamp(),
              },
            ]);
            setIsLoading(false);
            handleToastSuccess(
              `Thêm mục tiêu mới thành công ! (${result.id}) `
            );
          })
          .catch((eror) => {
            setIsLoading(false);
            handleToastError("Thêm mục tiêu mới thất bại !");
          });
      }
      if (form.nameSuggest) {
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
            setIsLoading(false);
            handleToastSuccess(`Thêm gợi ý mới thành công ! (${result.id}) `);
          })
          .catch((eror) => {
            setIsLoading(false);
            handleToastError("Thêm gợi ý mới thất bại !");
          });
      }
    }
    setForm({ nameSuggest: "", nameTarget: "", fieldId: "", level: 0 });
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
            title="Tìm mục tiêu"
            placeholder="Nhập mục tiêu"
            width={"75%"}
            arrSource={targets}
            type="searchTarget"
            onChange={(val) => setNewTargets(val)}
          />
          <TextComponent
            text={`Có ${newTargets.length} mục tiêu`}
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
              <th scope="col">Tên mục tiêu</th>
              <th scope="col">Level</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {newTargets.length > 0 &&
              newTargets.map((target, index) => (
                <AdminTargetComponent
                  key={index}
                  target={target}
                  targets={newTargets}
                  fields={fields}
                  setTargetdEdit={setTargetEdit}
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
        {targetEdit && (
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
                setForm({nameSuggest:'', nameTarget:'', level:0, fieldId:''})
                setTargetEdit(undefined)
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
            text={targetEdit ? "Chỉnh sửa mục tiêu" : "Thêm mục tiêu"}
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
            Nội dung mục tiêu:
          </label>
          <textarea
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
            value={form.nameTarget}
            onChange={(e) => setForm({ ...form, nameTarget: e.target.value })}
            className="form-control"
            placeholder="Nhập nội dung mục tiêu"
            rows={6}
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Level mục tiêu
          </label>
          <select
            value={form.level}
            className={`form-select ${widthSmall && "form-select-sm"}`}
            aria-label="Default select example"
            onChange={(val) =>
              setForm({ ...form, level: Number(val.target.value) })
            }
          >
            <option defaultValue={""}>Chọn</option>
            <option value={1}> {1}</option>
            <option value={2}> {2}</option>
            <option value={3}> {3}</option>
            <option value={4}> {4}</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Gợi ý cho mục tiêu:
          </label>

          <textarea
            disabled={targetEdit ? true : false}
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
          onClick={disable ? undefined : handleTargetField}
        >
          {isLoading ? (
            <SpinnerComponent />
          ) : (
            <>{targetEdit ? "Cập nhật" : "Thêm mới"}</>
          )}
        </button>
      </div>

      <LoadingOverlay show={isLoading} />

      <ModalDeleteComponent
        data={{
          id: targetEdit?.id as string,
          nameCollect: "targets",
          itemTasks: [],
        }}
      />
    </RowComponent>
  );
}
