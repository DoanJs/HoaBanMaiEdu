import { doc, getDoc, serverTimestamp, where } from "firebase/firestore";
import {
  AddCircle,
  ArchiveTick,
  DocumentDownload,
  SaveAdd,
  Trash,
} from "iconsax-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ModalDeleteComponent,
  ReportItemComponent,
  RowComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from ".";
import { colors } from "../constants/colors";
import { convertTargetField } from "../constants/convertTargetAndField";
import { handleTimeStampFirestore } from "../constants/convertTimeStamp";
import { getDocsData } from "../constants/firebase/getDocsData";
import { updateDocData } from "../constants/firebase/updateDocData";
import { groupArrayWithField } from "../constants/groupArrayWithField";
import { handleToastError, handleToastSuccess } from "../constants/handleToast";
import { widthSmall } from "../constants/reponsive";
import { sizes } from "../constants/sizes";
import { exportWord } from "../exportFile/WordExport";
import { db } from "../firebase.config";
import { PlanTaskModel, ReportTaskModel } from "../models";
import {
  useChildStore,
  useFieldStore,
  useReportStore,
  useTargetStore,
  useUserStore,
} from "../zustand";
import LoadingOverlay from "./LoadingOverLay";

export default function ReportListComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, reportId, status, comment, report } = location.state || {};
  const [reportTasks, setReportTasks] = useState<ReportTaskModel[]>([]);
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const [disableComment, setDisableComment] = useState(true);
  const [isComment, setIsComment] = useState(false);
  const [text, setText] = useState("");
  const { reports, editReport } = useReportStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (reportId) {
      if (comment) {
        setIsComment(true);
        setText(comment.split("@Js@")[1]);
      }
      getDocsData({
        nameCollect: "reportTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("reportId", "==", reportId),
        ],
        setData: setReportTasks,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);
  useEffect(() => {
    if (text !== comment?.split("@Js@")[1]) {
      setDisableComment(false);
    } else {
      setDisableComment(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  useEffect(() => {
    if (reportTasks.length > 0) {
      getPlanTasks(reportTasks);
    }
  }, [reportTasks]);

  const getPlanTasks = async (reportTasks: ReportTaskModel[]) => {
    const promiseItems = reportTasks.map(async (reportTask) => {
      const docSnap = await getDoc(doc(db, "planTasks", reportTask.planTaskId));
      return {
        ...docSnap.data(),
        id: docSnap.id,
      };
    });
    const result = await Promise.all(promiseItems);

    setPlanTasks(result as PlanTaskModel[]);
  };
  const handleSaveReportTask = async () => {
    // luu phia firestore
    if (!disable) {
      try {
        setIsLoading(true);
        const promiseItems = reportTasks.map((_) =>
          updateDocData({
            nameCollect: "reportTasks",
            id: _.id,
            valueUpdate: {
              content: _.content,
              updateAt: serverTimestamp(),
            },
            metaDoc: "reports",
          })
        );

        const updateReport = await updateDocData({
          nameCollect: "reports",
          id: reportId,
          valueUpdate: {
            updateById: user?.id,
          },
          metaDoc: "reports",
        });

        await Promise.all([...promiseItems, updateReport]);
        handleToastSuccess("Chỉnh sửa báo cáo thành công !");
        setIsLoading(false);
        setDisable(true);
      } catch (error) {
        handleToastError("Chỉnh sửa báo cáo thất bại !");
        setIsLoading(false);
        setDisable(true);
      }
    }
  };
  const handleExportWordBC = async () => {
    setIsLoading(true);
    const promiseItems = handleGroupReportWithField(reportTasks).map(
      async (reportTask) => {
        const docSnap = await getDoc(
          doc(db, "planTasks", reportTask.planTaskId)
        );
        if (docSnap.exists()) {
          return {
            intervention: docSnap.data().intervention,
            content: docSnap.data().content,
            field: convertTargetField(docSnap.data().targetId, targets, fields)
              .nameField,
            target: convertTargetField(docSnap.data().targetId, targets, fields)
              .nameTarget,
            total: reportTask.content,
          };
        } else {
          console.log(`getDoc data error`);
        }
      }
    );
    const result = await Promise.all(promiseItems);

    exportWord(
      {
        rows: result,
        title: title.substring(2).trim(),
        child: child?.fullName,
        teacher: user?.fullName,
      },
      "/template_BC.docx"
    );
    setIsLoading(false);
  };
  const handleSaveComment = async () => {
    setIsLoading(true);
    const indexReport = reports.findIndex((report) => report.id === reportId);
    editReport(reportId, {
      ...reports[indexReport],
      comment: text ? `${user?.fullName}@Js@${text}` : "",
      updateById: user?.id,
    });

    await updateDocData({
      nameCollect: "reports",
      id: reportId,
      metaDoc: "reports",
      valueUpdate: {
        comment: text !== "" ? `${user?.fullName}@Js@${text}` : "",
        updateById: user?.id,
      },
    });
    setIsLoading(false);
    setDisableComment(true);
  };
  const handleApproved = () => {
    const indexReport = reports.findIndex((report) => report.id === reportId);
    editReport(reportId, { ...reports[indexReport], status: "approved" });

    setIsLoading(true);
    updateDocData({
      nameCollect: "reports",
      id: reportId,
      valueUpdate: { status: "approved", updateById: user?.id },
      metaDoc: "reports",
    })
      .then(() => {
        setIsLoading(false);
        navigate("../pending");
        handleToastSuccess("Báo cáo được duyệt thành công !");
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Duyệt báo cáo thất bại !");
        console.log(error);
      });
  };
  const getPlanTask = (planTaskId: string, planTasks: PlanTaskModel[]) => {
    const index = planTasks.findIndex((planTask) => planTask.id === planTaskId);
    if (index !== -1) {
      return planTasks[index];
    }
  };
  const handleGroupReportWithField = (reportTasks: ReportTaskModel[]) => {
    return groupArrayWithField(
      reportTasks.map((reportTask) => {
        return {
          ...reportTask,
          fieldId: convertTargetField(
            getPlanTask(reportTask.planTaskId, planTasks)?.targetId as string,
            targets,
            fields
          ).fieldId,
        };
      }),
      "fieldId"
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <RowComponent
        justify="space-between"
        styles={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          width: "100%",
          padding: 10,
          borderBottom: "1px solid",
          borderBottomColor: colors.gray,
        }}
      >
        <TextComponent
          text={`${title}`}
          size={widthSmall ? sizes.thinTitle : sizes.bigTitle}
          styles={{ fontWeight: "bold" }}
        />
        <SpaceComponent width={6} />
        <TextComponent
          styles={{ fontStyle: "italic" }}
          text={`Gửi lên lúc: ${moment(
            handleTimeStampFirestore(report?.createAt)
          ).format("HH:mm:ss_DD/MM/YYYY")}`}
          size={widthSmall ? sizes.text : sizes.bigText}
        />

        <SpaceComponent width={10} />

        {handleTimeStampFirestore(report?.createAt) !==
          handleTimeStampFirestore(report?.updateAt) && (
          <TextComponent
            styles={{ fontStyle: "italic" }}
            text={`Cập nhật lúc: ${moment(
              handleTimeStampFirestore(report?.updateAt)
            ).format("HH:mm:ss DD/MM/YYYY")}`}
            size={widthSmall ? sizes.text : sizes.bigText}
          />
        )}
      </RowComponent>

      <div
        style={{ maxHeight: widthSmall ? "80%" : "85%", overflowY: "scroll" }}
      >
        <table
          className="table table-bordered"
          style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
        >
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Mục tiêu</th>
              <th scope="col">Mức độ hỗ trợ</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Tổng kết</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "justify" }}>
            {reportTasks &&
              handleGroupReportWithField(reportTasks).map((_, index) => (
                <ReportItemComponent
                  key={index}
                  reportTask={_}
                  setDisable={setDisable}
                  reportTasks={reportTasks}
                  onSetReportTasks={setReportTasks}
                  status={status}
                />
              ))}
          </tbody>
        </table>

        {isComment && (
          <>
            <TextComponent
              text={`Góp ý từ cô ${comment.split("@Js@")[0]}: `}
              size={widthSmall ? sizes.text : sizes.bigTitle}
              styles={{ fontWeight: "bold" }}
            />
            <SpaceComponent height={4} />
            <RowComponent>
              <textarea
                style={{
                  padding: 10,
                  textAlign: "justify",
                  color: colors.red,
                }}
                disabled={
                  !["Phó Giám đốc", "Giám đốc"].includes(
                    user?.position as string
                  )
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="form-control"
                placeholder="Nhập góp ý"
                rows={5}
              ></textarea>
            </RowComponent>
            <SpaceComponent height={10} />
          </>
        )}
      </div>
      {status === "pending" ? (
        <>
          <RowComponent justify="space-between">
            {["Phó Giám đốc", "Giám đốc"].includes(user?.position as string) &&
              (isComment ? (
                <button
                  onClick={disableComment ? undefined : handleSaveComment}
                  type="button"
                  className="btn btn-success"
                  data-bs-dismiss="modal"
                  style={{
                    background: disableComment ? colors.gray : colors.primary,
                    borderColor: disableComment ? colors.gray : colors.primary,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SaveAdd
                    size={widthSmall ? sizes.smallTitle : sizes.bigTitle}
                    color={colors.bacground}
                  />
                  <SpaceComponent width={6} />
                  <TextComponent
                    text="Lưu góp ý"
                    size={widthSmall ? sizes.text : sizes.bigText}
                    color={colors.bacground}
                  />
                </button>
              ) : (
                <div
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => setIsComment(true)}
                >
                  <AddCircle
                    size={widthSmall ? sizes.smallTitle : sizes.bigTitle}
                    color={colors.primary}
                    variant="Bold"
                  />
                  <SpaceComponent width={4} />
                  <TextComponent
                    text="Góp ý"
                    size={widthSmall ? sizes.text : sizes.bigText}
                  />
                </div>
              ))}

            {user?.role === "admin" && (
              <RowComponent
                styles={{
                  cursor: "pointer",
                }}
                onClick={handleApproved}
              >
                <ArchiveTick
                  size={widthSmall ? sizes.smallTitle : sizes.bigTitle}
                  color={colors.primary}
                  variant="Bold"
                />
                <TextComponent
                  text="Duyệt"
                  size={widthSmall ? sizes.text : sizes.bigText}
                  styles={{ fontWeight: "bold" }}
                />
              </RowComponent>
            )}

            <RowComponent justify="flex-end">
              <button
                onClick={disable ? undefined : handleSaveReportTask}
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  background: disable ? colors.gray : undefined,
                  borderColor: disable ? colors.gray : undefined,
                }}
              >
                {isLoading ? (
                  <SpinnerComponent />
                ) : (
                  <>
                    <SaveAdd
                      size={widthSmall ? sizes.text : sizes.bigText}
                      color={colors.bacground}
                    />
                    <SpaceComponent width={6} />
                    <TextComponent
                      text="Lưu"
                      size={widthSmall ? sizes.text : sizes.bigText}
                      color={colors.bacground}
                    />
                  </>
                )}
              </button>
              <SpaceComponent width={10} />
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Trash
                  size={widthSmall ? sizes.text : sizes.bigText}
                  color={colors.bacground}
                />
                <SpaceComponent width={6} />
                <TextComponent
                  text="Xóa"
                  size={widthSmall ? sizes.text : sizes.bigText}
                  color={colors.bacground}
                />
              </button>
            </RowComponent>
          </RowComponent>

          <ModalDeleteComponent
            data={{
              id: reportId,
              nameCollect: "reports",
              itemTasks: reportTasks,
            }}
          />
        </>
      ) : (
        <RowComponent justify="flex-end">
          <button
            onClick={handleExportWordBC}
            type="button"
            className="btn btn-primary"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoading ? (
              <SpinnerComponent />
            ) : (
              <>
                <DocumentDownload
                  size={widthSmall ? sizes.bigText : sizes.smallTitle}
                  color={colors.bacground}
                />
                <SpaceComponent width={6} />
                <TextComponent
                  text="Xuất File"
                  size={widthSmall ? sizes.text : sizes.bigText}
                  color={colors.bacground}
                />
              </>
            )}
          </button>
        </RowComponent>
      )}

      <LoadingOverlay show={isLoading} />
    </div>
  );
}
