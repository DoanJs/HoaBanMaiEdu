import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { db, functions } from "../../firebase.config";
import { CartModel } from "../../models/CartModel";
import { PlanTaskModel } from "../../models/PlanTaskModel";
import { ReportTaskModel } from "../../models/ReportTaskModel";
import { useUserStore } from "../../zustand";
import usePlanStore from "../../zustand/usePlanStore";
import useReportStore from "../../zustand/useReportStore";
import LoadingOverlay from "../LoadingOverLay";
import { httpsCallable } from "firebase/functions";

interface DataModel {
  id: string;
  nameCollect: string;
  itemTasks: ReportTaskModel[] | PlanTaskModel[] | CartModel[];
  setForm?: any;
  setEdit?: any;
}
interface Props {
  data: DataModel;
}

export default function ModalDeleteComponent(props: Props) {
  const { data } = props;
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { removePlan } = usePlanStore();
  const { removeReport } = useReportStore();
  const [isLoading, setIsLoading] = useState(false);

  // const deleteReportPending = async (reportId: string) => {
  //   removeReport(reportId);
  //   setIsLoading(true);

  //   const reportTasks = await getDocs(
  //     query(
  //       collection(db, "reportTasks"),
  //       where("teacherIds", "array-contains", user?.id),
  //       where("reportId", "==", reportId)
  //     )
  //   );

  //   if (!reportTasks.empty) {
  //     const promiseReportTasks = reportTasks.docs.map((_) =>
  //       deleteDocData({
  //         nameCollect: "reportTasks",
  //         id: _.id,
  //         metaDoc: "reports",
  //       })
  //     );
  //     await Promise.all(promiseReportTasks);
  //   }

  //   await deleteDocData({
  //     nameCollect: "reports",
  //     id: reportId,
  //     metaDoc: "reports",
  //   });

  //   handleToastSuccess("Xóa báo cáo thành công !");
  //   setIsLoading(false);
  //   navigate("../pending");
  // };
  const deleteReportPending = async (reportId: string) => {
    removeReport(reportId);
    try {
      setIsLoading(true);

      const deleteReport = httpsCallable<{ reportId: string }, { ok: boolean }>(
        functions,
        "deleteReport"
      );

      await deleteReport({ reportId });

      // cập nhật UI sau khi backend xoá xong
      // removeReport(reportId);

      handleToastSuccess("Xóa báo cáo thành công!");
      navigate("../pending");
    } catch (err: any) {
      console.error(err);

      if (err.code === "permission-denied") {
        handleToastError("Bạn không có quyền xoá báo cáo");
      } else {
        handleToastError("Không thể xoá báo cáo");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const deletePlanPending = async (planId: string) => {
    removePlan(planId);
    try {
      setIsLoading(true);

      const deletePlan = httpsCallable<{ planId: string }, { ok: boolean }>(
        functions,
        "deletePlan"
      );

      await deletePlan({ planId });

      // cập nhật UI sau khi backend xoá xong
      // removePlan(planId);

      handleToastSuccess("Xóa kế hoạch thành công!");
      navigate("../pending");
    } catch (err: any) {
      console.error(err);

      if (err.code === "permission-denied") {
        handleToastError("Bạn không có quyền xoá kế hoạch");
      } else {
        handleToastError("Không thể xoá kế hoạch");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const deleteChildren = async (childId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "children",
      id: childId,
      metaDoc: "children",
    })
      .then(() => {
        setIsLoading(false);
        handleToastSuccess("Xóa trẻ thành công !");
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Xóa trẻ thất bại !");
      });
  };
  const deleteTarget = async (targetId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "targets",
      id: targetId,
      metaDoc: "targets",
    })
      .then(() => {
        setIsLoading(false);
        handleToastSuccess("Xóa mục tiêu thành công !");
        data.setForm({
          nameSuggest: "",
          nameTarget: "",
          level: 0,
          fieldId: "",
        });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Xóa mục tiêu thất bại !");
      });
  };
  const deleteSuggest = async (suggestId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "suggests",
      id: suggestId,
      metaDoc: "suggests",
    })
      .then(() => {
        setIsLoading(false);
        handleToastSuccess("Xóa gợi ý thành công !");
        data.setForm({ fieldId: "", nameSuggest: "" });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Xóa gợi ý thất bại !");
      });
  };
  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "users",
      id: userId,
      metaDoc: "users",
    })
      .then(() => {
        setIsLoading(false);
        handleToastSuccess("Xóa giáo viên thành công !");
        data.setForm({
          fullName: "",
          avatar: "",
          role: "",
          email: "",
          position: "",
        });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Xóa giáo viên thất bại !");
      });
  };
  const deletePlanApproved = async (planId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "plans",
      id: planId,
      metaDoc: "plans",
    })
      .then(() => {
        setIsLoading(false);
        handleToastSuccess("Xóa kế hoạch Approved thành công !");
        data.setForm({
          title: "",
          status: "pending",
        });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Xóa kế hoạch Approved thất bại !");
      });
  };
  const deleteReportApproved = async (reportId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "reports",
      id: reportId,
      metaDoc: "reports",
    })
      .then(() => {
        setIsLoading(false);
        handleToastSuccess("Xóa báo cáo Approved thành công !");
        data.setForm({
          title: "",
          status: "pending",
        });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Xóa báo cáo Approved thất bại !");
      });
  };
  const deleteMeta = async (metaId: string) => {
    setIsLoading(true);
    deleteDoc(doc(db, "Meta", metaId))
      .then(() => {
        setIsLoading(false);
        handleToastSuccess("Xóa meta thành công !");
        data.setForm({
          name: "",
          lastUpdated: Date.now(),
        });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Xóa meta thất bại !");
      });
  };
  const deleteCart = async (carts: CartModel[]) => {
    setIsLoading(true);
    const promiseItems = carts.map((cart) =>
      deleteDocData({
        nameCollect: "carts",
        id: cart.id,
        metaDoc: "carts",
      })
    );

    Promise.all(promiseItems)
      .then(() => {
        setIsLoading(false);
        data.setForm([]);
        handleToastSuccess("Reset giỏ mục tiêu thành công !");
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Reset giỏ mục tiêu thất bại !");
      });
  };

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

      case "targets":
        deleteTarget(data.id);
        break;

      case "suggests":
        deleteSuggest(data.id);
        break;

      case "users":
        deleteUser(data.id);
        break;

      case "Meta":
        deleteMeta(data.id);
        break;

      case "carts":
        deleteCart(data.itemTasks as CartModel[]);
        break;

      case "planApproveds":
        deletePlanApproved(data.id);
        break;
      case "reportApproveds":
        deleteReportApproved(data.id);
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
