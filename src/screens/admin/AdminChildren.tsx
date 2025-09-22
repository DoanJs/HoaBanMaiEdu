import { serverTimestamp } from "firebase/firestore";
import { AddCircle, Trash, UserAdd } from "iconsax-react";
import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
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
import { ChildrenModel, UserModel } from "../../models";
import { useUserStore } from "../../zustand";
import AdminChildComponent from "./AdminChildComponent";
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
    avatar: "",
  });

  useEffect(() => {
    if (childEdit) {
      setForm({
        fullName: childEdit.fullName,
        avatar: childEdit.avatar,
      });
      setSelectTeachers(
        childEdit.teacherIds.map((_) => {
          const indexTeacher = teachers.findIndex(
            (teacher) => teacher.id === _
          );
          return { id: _, fullName: teachers[indexTeacher].fullName };
        })
      );
    }
  }, [childEdit]);
  useEffect(() => {
    if (form.avatar && form.fullName && selectTeachers.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [form, selectTeachers]);

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
    if (children.length > 0) {
      setNewChildren(children);
    }
  }, [children]);

  const handleChild = async () => {
    const data = {
      fullName: form.fullName,
      avatar: form.avatar,
      teacherIds: selectTeachers.map((_) => _.id),
    };

    setIsLoading(true);
    if (childEdit) {
      updateDocData({
        nameCollect: "children",
        id: childEdit.id,
        valueUpdate: {
          ...data,
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "children",
      })
        .then((result) => {
          setIsLoading(false);
          setForm({ fullName: "", avatar: "" });
          setSelectTeachers([]);
          setChildEdit(undefined);
          handleToastSuccess(
            `Chỉnh sửa thông tin trẻ thành công ! (${childEdit.fullName}) `
          );
        })
        .catch((eror) => {
          setIsLoading(false);
          handleToastError("Chỉnh sửa thông tin trẻ mới thất bại !");
        });
    } else {
      addDocData({
        nameCollect: "children",
        value: {
          ...data,
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "children",
      })
        .then((result) => {
          setNewChildren([
            ...newChildren,
            {
              ...data,
              id: result.id,
              createAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            },
          ]);
          setIsLoading(false);
          setForm({ fullName: "", avatar: "" });
          setSelectTeachers([]);
          handleToastSuccess(`Thêm trẻ mới thành công ! (${result.id}) `);
        })
        .catch((eror) => {
          setIsLoading(false);
          handleToastError("Thêm trẻ mới thất bại !");
        });
    }
  };

  return (
    <RowComponent
      styles={{
        alignItems: "flex-start",
        height: "85%",
      }}
    >
      <div style={{ flex: 2, height: "100%", overflowY: "scroll" }}>
        <RowComponent justify="space-between">
          <SearchComponent
            title="Tìm trẻ"
            placeholder="Nhập tên trẻ"
            width={"75%"}
            arrSource={children}
            type="searchChildren"
            onChange={(val) => setNewChildren(val)}
          />
          <TextComponent
            text={`Có ${newChildren.length} trẻ`}
            styles={{ fontWeight: "bold" }}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <table
          style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          className="table table-bordered"
        >
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">Tên trẻ</th>
              <th scope="col">Giáo viên PT</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {newChildren.length > 0 &&
              newChildren.map((child, index) => (
                <AdminChildComponent
                  key={index}
                  child={child}
                  teachers={teachers}
                  setChildEdit={setChildEdit}
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
          padding: "20px 40px",
          borderRadius: 10,
          position: "relative",
        }}
      >
        {childEdit && (
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
                setForm({fullName:'', avatar:''})
                setSelectTeachers([])
                setChildEdit(undefined)
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
            text={childEdit ? "Chỉnh sửa thông tin trẻ" : "Thêm trẻ mới"}
            size={widthSmall ? sizes.thinTitle : sizes.title}
            styles={{ fontWeight: "bold" }}
          />
        </RowComponent>
        <SpaceComponent height={10} />

        <div>
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label"
            style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
          >
            Tên trẻ:
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
            Hình đại diện trẻ:
          </label>
          <input
            onChange={(val) => setForm({ ...form, avatar: val.target.value })}
            type="fullName"
            className="form-control"
            value={form.avatar}
          />
        </div>
        <div>
          <label htmlFor="exampleFormControlInput1" className="form-label" style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}>
            Giáo viên phụ trách:
          </label>
          <Select
            getOptionLabel={(option) => option.fullName}
            getOptionValue={(option) => option.id.toString()}
            isMulti
            options={teachers}
            value={selectTeachers}
            onChange={(value: MultiValue<OptionType>) => {
              setSelectTeachers(value as OptionType[]);
            }}
          />
        </div>
        <SpaceComponent height={20} />
        <button
          style={{
            width: "100%",
            background: disable ? colors.gray : colors.orange,
            borderColor: disable ? colors.gray : colors.orange,
            fontWeight: "bold",
          }}
          type="button"
          className="btn btn-primary"
          onClick={disable ? undefined : handleChild}
        >
          {isLoading ? (
            <SpinnerComponent />
          ) : (
            <>{childEdit ? "Cập nhật" : "Đăng ký"}</>
          )}
        </button>
      </div>

      <LoadingOverlay show={isLoading} />

      <ModalDeleteComponent
        data={{
          id: childEdit?.id as string,
          nameCollect: "children",
          itemTasks: [],
        }}
      />
    </RowComponent>
  );
}
