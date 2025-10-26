import { serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddReportItemComponent,
  RowComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import { colors } from "../../constants/colors";
import { convertTargetField } from "../../constants/convertTargetAndField";
import { addDocData } from "../../constants/firebase/addDocData";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { PlanModel, PlanTaskModel, ReportSavedModel } from "../../models";
import {
  useChildStore,
  useFieldStore,
  usePlanStore,
  useReportSavedStore,
  useReportStore,
  useSelectTargetStore,
  useTargetStore,
  useUserStore,
} from "../../zustand";

export default function AddReportScreen() {
  const navigate = useNavigate();
  const { plans } = usePlanStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const [addReports, setAddReports] = useState<any[]>([]);
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { user } = useUserStore();
  const { child } = useChildStore();
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<PlanModel>();
  const { addReport } = useReportStore();
  const [planApprovals, setPlanApprovals] = useState<PlanModel[]>([]);
  const { setSelectTarget } = useSelectTargetStore();
  const { reportSaveds, removeReportSaved, addReportSaved } =
    useReportSavedStore();
  const [isReportSaved, setIsReportSaved] = useState(false);
  const [planSelected, setPlanSelected] = useState("");

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "approved");
      setPlanApprovals(items);
    }
  }, [plans]);

  useEffect(() => {
    if (addReports.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [addReports]);

  useEffect(() => {
    if (planTasks) {
      // if (isReportSaved) {
      //   setAddReports(
      //     planTasks.map((planTask: any) => {
      //       const { id, ..._ } = planTask;
      //       return {
      //         ..._,
      //         reportSavedId: id,
      //         id: _.planTaskId,
      //       };
      //     })
      //   );
      // } else {
      //   setAddReports(planTasks);
      // }
      setAddReports(planTasks);
    }
  }, [planTasks]);

  const handleSelectPlan = (planId: string) => {
    setPlanSelected(planId);
    if (planId !== "") {
      const index = planApprovals.findIndex((_) => _.id === planId);
      setPlan(planApprovals[index]);

      const items = reportSaveds.filter(
        (reportSaved: ReportSavedModel) => reportSaved.planId === planId
      );
      if (items.length > 0) {
        setIsReportSaved(true);
        setPlanTasks(items);
      } else {
        setIsReportSaved(false);
        getDocsData({
          nameCollect: "planTasks",
          condition: [
            where("teacherIds", "array-contains", user?.id),
            where("planId", "==", planId),
          ],
          setData: setPlanTasks,
        });
      }
    } else {
      setPlanTasks([]);
      setDisable(true);
    }
    // if (planId !== "") {
    //   const index = planApprovals.findIndex((_) => _.id === planId);
    //   setPlan(planApprovals[index]);
    //   getDocsData({
    //     nameCollect: "planTasks",
    //     condition: [
    //       where("teacherIds", "array-contains", user?.id),
    //       where("planId", "==", planId),
    //     ],
    //     setData: setPlanTasks,
    //   });
    // } else {
    //   setPlanTasks([]);
    //   setDisable(true);
    // }
  };
  const handleAddReport = async () => {
    if (user && child) {
      setIsLoading(true);
      await addDocData({
        nameCollect: "reports",
        value: {
          type: "BC",
          title: plan?.title.replace("KH", "BC"),
          childId: child.id,
          teacherIds: child.teacherIds,
          planId: plan?.id,
          status: "pending",
          comment: "",

          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "reports",
      })
        .then(async (result) => {
          addReport({
            id: result.id,
            type: "BC",
            title: plan?.title.replace("KH", "BC") as string,
            childId: child.id,
            teacherIds: child.teacherIds,
            authorId: user.id,
            planId: plan?.id as string,
            status: "pending",
            comment: "",

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          });
          const promiseItems = addReports.map((_) =>
            addDocData({
              nameCollect: "reportTasks",
              value: {
                reportId: result.id,
                planId: plan?.id as string,
                childId: child.id,
                planTaskId: isReportSaved ? _.planTaskId : _.id,
                content: _.total ?? "",
                isEdit: false,
                teacherIds: child.teacherIds,

                createAt: serverTimestamp(),
                updateAt: serverTimestamp(),
              },
              metaDoc: "reports",
            })
          );

          await Promise.all(promiseItems);

          if (isReportSaved) {
            const promiseReportSavedtems = addReports.map((reportSaved) => {
              deleteDocData({
                nameCollect: "reportSaveds",
                id: reportSaved.id,
                metaDoc: "reportSaveds",
              });
              removeReportSaved(reportSaved.id);
            });
            await Promise.all(promiseReportSavedtems);
          }

          setIsReportSaved(false);
          handleToastSuccess("Thêm mới báo cáo thành công !");
          setIsLoading(false);
        })
        .catch((error) => {
          handleToastError("Thêm mới báo cáo thất bại !");
          setIsLoading(false);
          console.log(error);
        });
      navigate("../pending");
      setSelectTarget("CHỜ DUYỆT");
    }
  };
  const handleSaveReportSaved = async () => {
    // console.log(addReports);
    // console.log("reportSaveds: ", reportSaveds);

    setIsLoading(true);
    if (isReportSaved) {
      // xoa het them lai
      const promiseReportSavedtems = addReports.map((reportSaved) =>
        deleteDocData({
          nameCollect: "reportSaveds",
          id: reportSaved.id,
          metaDoc: "reportSaveds",
        })
      );
      await Promise.all(promiseReportSavedtems);
    }

    // them moi tat ca
    const promiseItems = addReports.map((_) => {
      const { id, ...data } = _;
      addDocData({
        nameCollect: "reportSaveds",
        value: {
          ...data,
          planTaskId: _.planTaskId ?? id,
          total: _.total ?? "",
        },
        metaDoc: "reportSaveds",
      }).then((result) => {
        removeReportSaved(_.id);
        addReportSaved({
          ...data,
          planTaskId: _.planTaskId ?? id,
          total: _.total ?? "",
          id: result.id,
        });

        setPlanSelected("");
        setPlanTasks([]);
        setDisable(true);
      });
    });

    Promise.all(promiseItems)
      .then(() => {
        setIsLoading(false);
        setIsReportSaved(true);
        handleToastSuccess("Lưu nháp báo cáo thành công !");
      })
      .catch((error) => {
        setIsLoading(false);
        handleToastError("Lưu nháp báo cáo thất bại !");
        console.log(error);
      });
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <RowComponent
        justify="flex-start"
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
          text="Tạo báo cáo tháng"
          size={widthSmall ? sizes.thinTitle : sizes.bigTitle}
          styles={{ fontWeight: "bold" }}
        />
        <SpaceComponent width={10} />
        <select
          onChange={(val) => handleSelectPlan(val.target.value)}
          className={`form-select ${widthSmall && "form-select-sm"}`}
          aria-label="Default select example"
          style={{ width: "30%" }}
          value={planSelected}
        >
          <option value={""}>Chọn kế hoạch tháng đã duyệt</option>
          {planApprovals &&
            planApprovals.map((plan, index) => (
              <option key={index} value={plan.id}>
                {plan.title}
              </option>
            ))}
        </select>
      </RowComponent>

      <div style={{ height: "100%", overflowY: "scroll" }}>
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
          <tbody>
            {addReports &&
              groupArrayWithField(
                addReports.map((_) => {
                  return {
                    ..._,
                    fieldId: convertTargetField(_.targetId, targets, fields)
                      .fieldId,
                  };
                }),
                "fieldId"
              ).map((_, index) => (
                <AddReportItemComponent
                  key={index}
                  addReport={_}
                  addReports={addReports}
                  targets={targets}
                  fields={fields}
                />
              ))}
          </tbody>
        </table>
      </div>

      {!disable && (
        <RowComponent justify="flex-end" styles={{ padding: 10 }}>
          <button
            type="button"
            className={`btn btn-${isReportSaved ? "warning" : "success"}`}
            style={{
              background: disable ? colors.gray : undefined,
              borderColor: disable ? colors.gray : undefined,
              fontSize: widthSmall ? sizes.smallTitle : sizes.title,
            }}
            onClick={disable ? undefined : handleSaveReportSaved}
          >
            {isLoading ? (
              <SpinnerComponent />
            ) : (
              <TextComponent
                text={isReportSaved ? "Cập nhập lưu nháp" : "Tạo bản lưu nháp"}
                color={colors.bacground}
              />
            )}
          </button>
          <SpaceComponent width={20} />
          <button
            type="button"
            className="btn btn-primary"
            style={{
              background: disable ? colors.gray : undefined,
              borderColor: disable ? colors.gray : undefined,
              fontSize: widthSmall ? sizes.smallTitle : sizes.title,
            }}
            onClick={disable ? undefined : handleAddReport}
          >
            {isLoading ? (
              <SpinnerComponent />
            ) : (
              <TextComponent text="Tạo mới" color={colors.bacground} />
            )}
          </button>
        </RowComponent>
      )}

      <LoadingOverlay show={isLoading} />
    </div>
  );
}
