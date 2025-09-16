import { doc, getDoc, serverTimestamp, where } from "firebase/firestore";
import { DocumentDownload, SaveAdd, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ModalDeleteComponent,
  ReportItemComponent,
  RowComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from ".";
import { colors } from "../constants/colors";
import { getDocsData } from "../constants/firebase/getDocsData";
import { updateDocData } from "../constants/firebase/updateDocData";
import { showTargetAndField } from "../constants/showTargetAndField";
import { exportWord } from "../exportFile/WordExport";
import { db } from "../firebase.config";
import { ReportTaskModel } from "../models";
import { useChildStore, useFieldStore, useTargetStore, useUserStore } from "../zustand";

export default function ReportListComponent() {
  const location = useLocation();
  const { title, reportId, status } = location.state || {};
  const [reportTasks, setReportTasks] = useState<ReportTaskModel[]>([]);
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { child } = useChildStore();
  const { user } = useUserStore();

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (reportId) {
      getDocsData({
        nameCollect: "reportTasks",
        condition: [where("reportId", "==", reportId)],
        setData: setReportTasks,
      });
    }
  }, [reportId]);

  const handleSaveReportTask = async () => {
    // luu phia firestore
    if (!disable) {
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
      await Promise.all(promiseItems);

      setIsLoading(false);
      setDisable(true);
    }
  };

  const handleExportWordBC = async () => {
    setIsLoading(true);
    const promiseItems = reportTasks.map(async (reportTask) => {
      const docSnap = await getDoc(doc(db, "planTasks", reportTask.planTaskId));
      if (docSnap.exists()) {
        return {
          intervention: docSnap.data().intervention,
          content: docSnap.data().content,
          field: showTargetAndField(targets, docSnap.data().targetId, fields)
            .field,
          target: showTargetAndField(targets, docSnap.data().targetId, fields)
            .name,
          total: reportTask.content,
        };
      } else {
        console.log(`getDoc data error`);
      }
    });
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
        <TextComponent text={`${title}`} size={32} />
      </RowComponent>

      <div style={{ maxHeight: "85%", overflowY: "scroll" }}>
        <table className="table table-bordered">
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
              reportTasks.map((_, index) => (
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
      </div>
      {status === "pending" ? (
        <>
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
                  <SaveAdd size={20} color={colors.bacground} />
                  <SpaceComponent width={6} />
                  <TextComponent text="Lưu" color={colors.bacground} />
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
              <Trash size={20} color={colors.bacground} />
              <SpaceComponent width={6} />
              <TextComponent text="Xóa" color={colors.bacground} />
            </button>
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
                <DocumentDownload size={20} color={colors.bacground} />
                <SpaceComponent width={6} />
                <TextComponent text="Xuất File" color={colors.bacground} />
              </>
            )}
          </button>
        </RowComponent>
      )}
    </div>
  );
}
