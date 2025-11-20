import { where } from "firebase/firestore";
import { AddCircle, Trash } from "iconsax-react";
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
import { getDocsData } from "../../constants/firebase/getDocsData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { ChildrenModel, ReportModel, ReportTaskModel, UserModel } from "../../models";
import { useUserStore } from "../../zustand";
import AdminReportComponent from "./AdminReportComponent";

interface OptionType {
  id: string;
  fullName: string;
}

export default function AdminReport() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [form, setForm] = useState({
    title: "",
    status: "pending",
  });

  const [reports, setReports] = useState<ReportModel[]>([]);
  const [newReports, setNewReports] = useState<ReportModel[]>([]);
  const [reportEdit, setReportEdit] = useState<ReportModel>();
  const [children, setChildren] = useState<ChildrenModel[]>([]);
  const [teachers, setTeachers] = useState<UserModel[]>([]);
  const [selectTeachers, setSelectTeachers] = useState<OptionType[]>([]);
  const [reportTasks, setReportTasks] = useState<ReportTaskModel[]>([]);

  useEffect(() => {
    if (reportEdit) {
      setForm({
        title: reportEdit.title,
        status: reportEdit.status,
      });
      setSelectTeachers(
        reportEdit.teacherIds.map((_) => {
          const indexTeacher = teachers.findIndex(
            (teacher) => teacher.id === _
          );
          return { id: _, fullName: teachers[indexTeacher].fullName };
        })
      );
      getDocsData({
        nameCollect: "reportTasks",
        condition: [where("planId", "==", reportEdit.planId)],
        setData: setReportTasks,
      });
    }
  }, [reportEdit]);

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
        nameCollect: "reports",
        setData: setReports,
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
    if (reports.length > 0) {
      setNewReports(reports);
    }
  }, [reports]);

  const handleSuggest = async () => {
    setIsLoading(true);
    if (reportEdit) {
      updateDocData({
        nameCollect: "reports",
        id: reportEdit.id,
        valueUpdate: {
          title: form.title,
          status: form.status,
          teacherIds: selectTeachers.map((_) => _.id),
        },
        metaDoc: "reports",
      })
        .then((result) => {
          setIsLoading(false);
          handleToastSuccess(
            `Chỉnh sửa báo cáo thành công ! (${reportEdit.id}) `
          );
        })
        .catch((error) => {
          setIsLoading(false);
          handleToastError("Chỉnh sửa báo cáo thất bại !");
        });

      const promiseItems = reportTasks.map((_) =>
        updateDocData({
          nameCollect: "reportTasks",
          id: _.id,
          valueUpdate: {
            teacherIds: selectTeachers.map((_) => _.id),
          },
          metaDoc: "reports",
        })
      );

      await Promise.all(promiseItems);
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
            title="Tìm báo cáo"
            placeholder="Nhập báo cáo"
            width={"75%"}
            arrSource={reports}
            children={children}
            type="searchReport"
            onChange={(val) => setNewReports(val)}
          />
          <TextComponent
            text={`Có ${newReports.length} báo cáo`}
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
              <th scope="col">Báo cáo</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {newReports.length > 0 &&
              newReports.map((report, index) => (
                <AdminReportComponent
                  key={index}
                  report={report}
                  children={children}
                  setReportEdit={setReportEdit}
                />
              ))}
          </tbody>
        </table>
      </div>

      <SpaceComponent width={20} />
      {reportEdit && (
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
              setReportEdit(undefined);
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
              text="Chỉnh sửa báo cáo"
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
              Tên báo cáo:
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
          id: reportEdit?.id as string,
          nameCollect: "reportApproveds",
          itemTasks: [],
          setForm: setForm,
          setEdit: setReportEdit,
        }}
      />
    </RowComponent>
  );
}
