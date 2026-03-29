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
import {
  ChildrenModel,
  PlanModel,
  PlanTaskModel,
  UserModel,
} from "../../models";
import { useUserStore } from "../../zustand";
import AdminPlanComponent from "./AdminPlanComponent";
import Select, { MultiValue } from "react-select";
import { where } from "firebase/firestore";

interface OptionType {
  id: string;
  fullName: string;
}

export default function AdminPlan() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [form, setForm] = useState({
    title: "",
    status: "pending",
  });

  const [plans, setPlans] = useState<PlanModel[]>([]);
  const [newPlans, setNewPlans] = useState<PlanModel[]>([]);
  const [planEdit, setPlanEdit] = useState<PlanModel>();
  const [children, setChildren] = useState<ChildrenModel[]>([]);
  const [teachers, setTeachers] = useState<UserModel[]>([]);
  const [selectTeachers, setSelectTeachers] = useState<OptionType[]>([]);
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);


  useEffect(() => {
    if (planEdit) {
      setForm({
        title: planEdit.title,
        status: planEdit.status,
      });
      setSelectTeachers(
        planEdit.teacherIds.map((_) => {
          const indexTeacher = teachers.findIndex(
            (teacher) => teacher.id === _
          );
          return { id: _, fullName: teachers[indexTeacher].fullName };
        })
      );
      getDocsData({
        nameCollect: "planTasks",
        condition: [where("planId", "==", planEdit.id)],
        setData: setPlanTasks,
      });
    }
  }, [planEdit]);

  useEffect(() => {
    if (form.status && form.title) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [form]);

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

  useEffect(() => {
    if (plans.length > 0) {
      setNewPlans(plans);
    }
  }, [plans]);

  const handleSuggest = async () => {
    setIsLoading(true);
    if (planEdit) {
      updateDocData({
        nameCollect: "plans",
        id: planEdit.id,
        valueUpdate: {
          title: form.title,
          status: form.status,
          teacherIds: selectTeachers.map((_) => _.id),
        },
        metaDoc: "plans",
      })
        .then((result) => {
          setIsLoading(false);
          handleToastSuccess(
            `Chỉnh sửa kế hoạch thành công ! (${planEdit.id}) `
          );
        })
        .catch((error) => {
          setIsLoading(false);
          handleToastError("Chỉnh sửa kế hoạch thất bại !");
        });

      const promiseItems = planTasks.map((_) =>
        updateDocData({
          nameCollect: "planTasks",
          id: _.id,
          valueUpdate: {
            teacherIds: selectTeachers.map((_) => _.id),
          },
          metaDoc: "plans",
        })
      );

      await Promise.all(promiseItems)
    }
    setForm({ title: "", status: "pending" });
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
            title="Tìm kế hoạch"
            placeholder="Nhập kế hoạch"
            width={"75%"}
            arrSource={plans}
            children={children}
            type="searchPlan"
            onChange={(val) => setNewPlans(val)}
          />
          <TextComponent
            text={`Có ${newPlans.length} kế hoạch`}
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
              <th scope="col">Tên trẻ</th>
              <th scope="col">Kế hoạch</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {newPlans.length > 0 &&
              newPlans.map((plan, index) => (
                <AdminPlanComponent
                  key={index}
                  plan={plan}
                  children={children}
                  setPlantEdit={setPlanEdit}
                />
              ))}
          </tbody>
        </table>
      </div>

      <SpaceComponent width={20} />
      {planEdit && (
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
                title: "",
                status: "pending",
              });
              setPlanEdit(undefined);
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

          <RowComponent justify="center">
            <TextComponent
              text="Chỉnh sửa kế hoạch"
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
              Tên kế hoạch:
            </label>
            <input
              onChange={(val) => setForm({ ...form, title: val.target.value })}
              type="title"
              className="form-control"
              value={form.title}
            />
          </div>
          <div>
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label"
              style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
            >
              Trạng thái:
            </label>
            <select
              value={form.status}
              className={`form-select ${widthSmall && "form-select-sm"}`}
              aria-label="Default select example"
              onChange={(val) => setForm({ ...form, status: val.target.value })}
            >
              <option defaultValue={""}>Chọn</option>
              <option value={"pending"}>Pending</option>
              <option value={"approved"}>Approved</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label"
              style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
            >
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
            {isLoading ? <SpinnerComponent /> : "Cập nhật"}
          </button>
        </div>
      )}

      <LoadingOverlay show={isLoading} />

      <ModalDeleteComponent
        data={{
          id: planEdit?.id as string,
          nameCollect: "planApproveds",
          itemTasks: [],
          setForm: setForm,
          setEdit: setPlanEdit,
        }}
      />
    </RowComponent>
  );
}
