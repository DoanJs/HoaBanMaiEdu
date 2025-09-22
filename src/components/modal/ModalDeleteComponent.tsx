import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { handleToastError, handleToastSuccess } from "../../constants/handleToast";
import { db } from "../../firebase.config";
import { PlanTaskModel } from "../../models/PlanTaskModel";
import { ReportTaskModel } from "../../models/ReportTaskModel";
import { useUserStore } from "../../zustand";
import usePlanStore from "../../zustand/usePlanStore";
import useReportStore from "../../zustand/useReportStore";
import LoadingOverlay from "../LoadingOverLay";

interface DataModel {
  id: string;
  nameCollect: string;
  itemTasks: ReportTaskModel[] | PlanTaskModel[];
}
interface Props {
  data: DataModel;
}

export default function ModalDeleteComponent(props: Props) {
  const { data } = props;
  const { user } = useUserStore()
  const navigate = useNavigate();
  const { removePlan } = usePlanStore();
  const { removeReport } = useReportStore();
  const [isLoading, setIsLoading] = useState(false);

  const deleteReportPending = async (reportId: string) => {
    removeReport(reportId);
    setIsLoading(true)

    const reportTasks = await getDocs(
      query(collection(db, "reportTasks"),
        where("teacherIds", 'array-contains', user?.id),
        where("reportId", "==", reportId))
    );

    if (!reportTasks.empty) {
      const promiseReportTasks = reportTasks.docs.map((_) =>
        deleteDocData({
          nameCollect: "reportTasks",
          id: _.id,
          metaDoc: "reports",
        })
      );
      await Promise.all(promiseReportTasks);
    }

    await deleteDocData({
      nameCollect: "reports",
      id: reportId,
      metaDoc: "reports",
    });

    handleToastSuccess('Xóa báo cáo thành công !')
    setIsLoading(false)
    navigate("../pending");
  };
  const deletePlanPending = async (planId: string) => {
    removePlan(planId);
    setIsLoading(true)

    const promisePlanTasks = data.itemTasks.map((_) =>
      deleteDocData({
        nameCollect: "planTasks",
        id: _.id,
        metaDoc: "plans",
      })
    );
    await Promise.all(promisePlanTasks);

    await deleteDocData({
      nameCollect: "plans",
      id: planId,
      metaDoc: "plans",
    });

    handleToastSuccess('Xóa kế hoạch thành công !')
    setIsLoading(false)
    navigate("../pending");
  };
  const deleteChildren = async (childId: string) => {
    setIsLoading(true)
    deleteDocData({
      nameCollect: 'children',
      id: childId,
      metaDoc: 'children'
    }).then(() => {
      setIsLoading(false)
      handleToastSuccess('Xóa trẻ thành công !')
    }).catch((error) => {
      setIsLoading(false)
      handleToastError('Xóa trẻ thất bại !')
    })

  }

  const handleDelete = async () => {
    switch (data.nameCollect) {
      case "plans":
        deletePlanPending(data.id);
        break;

      case "reports":
        deleteReportPending(data.id);
        break;

      case "children":
        deleteChildren(data.id);
        break;

      default:
        break;
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Xóa dữ liệu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            Cô có chắc chắn sẽ xóa dữ liệu này không ?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={handleDelete}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      <LoadingOverlay show={isLoading} />
    </div>
  );
}
