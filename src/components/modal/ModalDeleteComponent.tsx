import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { db } from "../../firebase.config";
import { PlanTaskModel } from "../../models/PlanTaskModel";
import { ReportTaskModel } from "../../models/ReportTaskModel";
import usePlanStore from "../../zustand/usePlanStore";
import useReportStore from "../../zustand/useReportStore";

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
  const navigate = useNavigate();
  const { removePlan } = usePlanStore();
  const { removeReport } = useReportStore();

  const deleteReportPending = async (reportId: string) => {
    removeReport(reportId);

    await deleteDocData({
      nameCollect: "reports",
      id: reportId,
      metaDoc: "reports",
    });

    const reportTasks = await getDocs(
      query(collection(db, "reportTasks"), where("reportId", "==", reportId))
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
    navigate("../pending");
  };
  const deletePlanPending = async (planId: string) => {
    removePlan(planId);

    await deleteDocData({
      nameCollect: "plans",
      id: planId,
      metaDoc: "plans",
    });
    const promisePlanTasks = data.itemTasks.map((_) =>
      deleteDocData({
        nameCollect: "planTasks",
        id: _.id,
        metaDoc: "plans",
      })
    );
    await Promise.all(promisePlanTasks);

    navigate("../pending");
  };

  const handleDelete = async () => {
    switch (data.nameCollect) {
      case "plans":
        deletePlanPending(data.id);
        break;

      case "reports":
        deleteReportPending(data.id);

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
    </div>
  );
}
