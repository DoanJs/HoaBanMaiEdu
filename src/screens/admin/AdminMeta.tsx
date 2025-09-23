import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { AddCircle, Trash } from "iconsax-react";
import moment from "moment";
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
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { db } from "../../firebase.config";
import { UserModel } from "../../models";
import { useUserStore } from "../../zustand";
import AdminMetaComponent from "./AdminMetaComponent";

export default function AdminMeta() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [teacherEdit, setTeacherEdit] = useState<UserModel>();
  const [form, setForm] = useState({
    name: "",
    lastUpdated: Date.now(),
  });

  // ----------------
  const [meta, setMeta] = useState<any>([]);
  const [newMeta, setNewMeta] = useState<any[]>([]);
  const [metaEdit, setMetaEdit] = useState<any>();

  useEffect(() => {
    if (metaEdit) {
      setForm({
        name: metaEdit.id,
        lastUpdated:
          metaEdit.lastUpdated.seconds * 1000 +
          metaEdit.lastUpdated.nanoseconds / 1e6,
      });
    }
  }, [metaEdit]);
  useEffect(() => {
    if (form.lastUpdated && form.name) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [form]);
  useEffect(() => {
    if (user) {
      getDocsData({
        nameCollect: "Meta",
        setData: setMeta,
      });
    }
  }, [user]);
  useEffect(() => {
    if (meta.length > 0) {
      setNewMeta(meta);
    }
  }, [meta]);

  const handleMeta = async () => {
    const data = {
      name: form.name,
      lastUpdated: Timestamp.fromMillis(form.lastUpdated),
    };

    setIsLoading(true);
    if (metaEdit) {
      updateDoc(doc(db, "Meta", metaEdit.id), {
        lastUpdated: Timestamp.fromMillis(form.lastUpdated),
      })
        .then(() => {
          setMetaEdit(undefined);
          setIsLoading(false);
          handleToastSuccess(`Chỉnh sửa meta thành công ! (${metaEdit.id}) `);
        })
        .catch(() => {
          setIsLoading(false);
          handleToastError("Chỉnh sửa meta thất bại !");
        });
    } else {
      setDoc(
        doc(db, "Meta", data.name),
        { lastUpdated: data.lastUpdated },
        { merge: true }
      )
        .then((result) => {
          setNewMeta([
            ...newMeta,
            {
              id: data.name,
            },
          ]);
          setIsLoading(false);
          handleToastSuccess(`Thêm meta mới thành công ! (${data.name}) `);
        })
        .catch(() => {
          setIsLoading(false);
          handleToastError("Thêm meta mới thất bại !");
        });
    }
    setForm({
      name: "",
      lastUpdated: Date.now(),
    });
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
            title="Tìm meta"
            placeholder="Nhập meta"
            width={"75%"}
            arrSource={meta}
            type="searchMeta"
            onChange={(val) => setNewMeta(val)}
          />
          <TextComponent
            text={`Có ${newMeta.length} meta`}
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
              <th scope="col">Tên Meta</th>
              <th scope="col">Ngày gần nhất</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {newMeta.length > 0 &&
              newMeta.map((meta, index) => (
                <AdminMetaComponent
                  key={index}
                  meta={meta}
                  setMetaEdit={setMetaEdit}
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
        {metaEdit && (
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
                  lastUpdated: Date.now(),
                  name: "",
                });
                setMetaEdit(undefined);
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
            text={teacherEdit ? "Chỉnh sửa Meta" : "Thêm Meta"}
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
            Tên Meta:
          </label>
          <input
          disabled={metaEdit}
            onChange={(val) => setForm({ ...form, name: val.target.value })}
            type="fullName"
            className="form-control"
            value={form.name}
          />
        </div>
        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Chọn ngày:
          </label>
          <input
            onChange={(val) =>
              setForm({
                ...form,
                lastUpdated: new Date(val.target.value).getTime(),
              })
            }
            type="date"
            className="form-control"
            value={moment(form.lastUpdated).format("YYYY-MM-DD")}
          />
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
          onClick={disable ? undefined : handleMeta}
        >
          {isLoading ? (
            <SpinnerComponent />
          ) : (
            <>{metaEdit ? "Cập nhật" : "Thêm mới"}</>
          )}
        </button>
      </div>

      <LoadingOverlay show={isLoading} />

      <ModalDeleteComponent
        data={{
          id: metaEdit?.id as string,
          nameCollect: "Meta",
          itemTasks: [],
          setForm: setForm,
          setEdit: setMetaEdit,
        }}
      />
    </RowComponent>
  );
}
