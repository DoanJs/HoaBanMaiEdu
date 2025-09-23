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
import { validateEmail } from "../../constants/validateEmailPhone";
import { UserModel } from "../../models";
import { useUserStore } from "../../zustand";
import AdminTeacherComponent from "./AdminTeacherComponent";

export default function AdminTeacher() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [teachers, setTeachers] = useState<UserModel[]>([]);
  const [newTeachers, setNewTeachers] = useState<any[]>([]);
  const [teacherEdit, setTeacherEdit] = useState<UserModel>();
  const [form, setForm] = useState({
    fullName: "",
    avatar: "",
    role: "",
    email: "",
    position: "",
  });

  useEffect(() => {
    if (teacherEdit) {
      setForm({
        fullName: teacherEdit.fullName,
        avatar: teacherEdit.avatar,
        role: teacherEdit.role,
        email: teacherEdit.email,
        position: teacherEdit.position,
      });
    }
  }, [teacherEdit]);
  useEffect(() => {
    if (form.fullName && validateEmail(form.email)) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [form]);
  useEffect(() => {
    if (user) {
      getDocsData({
        nameCollect: "users",
        setData: setTeachers,
      });
    }
  }, [user]);
  useEffect(() => {
    if (teachers.length > 0) {
      setNewTeachers(teachers);
    }
  }, [teachers]);

  const handleTeacher = async () => {
    const data = {
      ...form,
      role: form.role !== "" ? form.role : "teacher",
      position: form.position !== "" ? form.position : "Chuyên viên tâm lý",
      phone: "",
      shortName: "",
      birth: serverTimestamp(),
      createAt: serverTimestamp(),
      updateAt: serverTimestamp(),
    };

    setIsLoading(true);
    if (teacherEdit) {
      updateDocData({
        nameCollect: "users",
        id: teacherEdit.id,
        valueUpdate: form,
        metaDoc: "users",
      })
        .then(() => {
          setTeacherEdit(undefined);
          setIsLoading(false);
          handleToastSuccess(
            `Chỉnh sửa giáo viên thành công ! (${teacherEdit.id}) `
          );
        })
        .catch(() => {
          setIsLoading(false);
          handleToastError("Chỉnh sửa giáo viên thất bại !");
        });
    } else {
      addDocData({
        nameCollect: "users",
        value: data,
        metaDoc: "suggests",
      })
        .then((result) => {
          setNewTeachers([
            ...newTeachers,
            {
              ...data,
              id: result.id,
            },
          ]);
          setIsLoading(false);
          handleToastSuccess(`Thêm giáo viên mới thành công ! (${result.id}) `);
        })
        .catch(() => {
          setIsLoading(false);
          handleToastError("Thêm giáo viên mới thất bại !");
        });
    }
    setForm({
      fullName: "",
      avatar: "",
      role: "",
      email: "",
      position: "",
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
            title="Tìm giáo viên"
            placeholder="Nhập giáo viên"
            width={"75%"}
            arrSource={teachers}
            type="searchTeacher"
            onChange={(val) => setNewTeachers(val)}
          />
          <TextComponent
            text={`Có ${newTeachers.length} giáo viên`}
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
              <th scope="col">Tên giáo viên</th>
              <th scope="col">Quyền</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {newTeachers.length > 0 &&
              newTeachers.map((teacher, index) => (
                <AdminTeacherComponent
                  key={index}
                  teacher={teacher}
                  setTeacherEdit={setTeacherEdit}
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
        {teacherEdit && (
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
                  fullName: "",
                  avatar: "",
                  role: "",
                  email: "",
                  position: "",
                });
                setTeacherEdit(undefined);
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
            text={teacherEdit ? "Chỉnh sửa giáo viên" : "Thêm giáo viên"}
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
            Họ và tên:
          </label>
          <input
            onChange={(val) => setForm({ ...form, fullName: val.target.value })}
            type="fullName"
            className="form-control"
            value={form.fullName}
          />
        </div>
        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Avatar:
          </label>
          <input
            onChange={(val) => setForm({ ...form, avatar: val.target.value })}
            type="fullName"
            className="form-control"
            value={form.avatar}
          />
        </div>
        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Email:
          </label>
          <input
            onChange={(val) => setForm({ ...form, email: val.target.value })}
            type="fullName"
            className="form-control"
            value={form.email}
          />
        </div>
        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Vị trí:
          </label>
          <select
            value={form.position}
            className={`form-select ${widthSmall && "form-select-sm"}`}
            aria-label="Default select example"
            onChange={(val) => setForm({ ...form, position: val.target.value })}
          >
            <option defaultValue={""}>Chọn</option>
            <option value={"Giám đốc"}>Giám đốc</option>
            <option value={"Phó Giám đốc"}>Phó Giám đốc</option>
            <option value={"Chuyên viên tâm lý"}>Chuyên viên tâm lý</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Quyền:
          </label>
          <select
            value={form.role}
            className={`form-select ${widthSmall && "form-select-sm"}`}
            aria-label="Default select example"
            onChange={(val) => setForm({ ...form, role: val.target.value })}
          >
            <option defaultValue={""}>Chọn</option>
            <option value={"admin"}>Admin</option>
            <option value={"teacher"}>Giáo viên</option>
          </select>
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
          onClick={disable ? undefined : handleTeacher}
        >
          {isLoading ? (
            <SpinnerComponent />
          ) : (
            <>{teacherEdit ? "Cập nhật" : "Thêm mới"}</>
          )}
        </button>
      </div>

      <LoadingOverlay show={isLoading} />

      <ModalDeleteComponent
        data={{
          id: teacherEdit?.id as string,
          nameCollect: "users",
          itemTasks: [],
          setForm: setForm,
          setEdit: setTeacherEdit,
        }}
      />
    </RowComponent>
  );
}
