import { serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RowComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { addDocData } from "../../constants/firebase/addDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { sizes } from "../../constants/sizes";
import { PlanModel } from "../../models/PlanModel";
import { PlanTaskModel } from "../../models/PlanTaskModel";
import useChildStore from "../../zustand/useChildStore";
import useFieldStore from "../../zustand/useFieldStore";
import usePlanStore from "../../zustand/usePlanStore";
import useReportStore from "../../zustand/useReportStore";
import useSelectTargetStore from "../../zustand/useSelectTargetStore";
import useTargetStore from "../../zustand/useTargetStore";
import useUserStore from "../../zustand/useUserStore";

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

  console.log(plans);

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
      setAddReports(planTasks);
    }
  }, [planTasks]);

  const handleSelectPlan = (planId: string) => {
    if (planId !== "") {
      const index = planApprovals.findIndex((_) => _.id === planId);
      setPlan(planApprovals[index]);
      getDocsData({
        nameCollect: "planTasks",
        condition: [where("planId", "==", planId)],
        setData: setPlanTasks,
      });
    } else {
      setDisable(true);
    }
  };
  const handleChangeValue = (data: { val: string; planTaskId: string }) => {
    const index = addReports.findIndex((_: any) => _.id === data.planTaskId);
    addReports[index].total = data.val;
    setAddReports(addReports);
  };
  const showTarget = (targetId: string) => {
    let field: string = "";
    let name: string = "";
    const index = targets.findIndex((target) => target.id === targetId);
    if (index !== -1) {
      const indexField = fields.findIndex(
        (_) => _.id === targets[index].fieldId
      );
      field = fields[indexField].name;
      name = targets[index].name;
    }

    return { name, field };
  };
  const handleAddReport = () => {
    if (user && child) {
      setIsLoading(true);
      addDocData({
        nameCollect: "reports",
        value: {
          type: "BC",
          title: plan?.title.replace("KH", "BC"),
          childId: child.id,
          teacherId: user.id,
          planId: plan?.id,
          status: "pending",

          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "reports",
      })
        .then(async (result) => {
          setIsLoading(false);
          addReport({
            id: result.id,
            type: "BC",
            title: plan?.title.replace("KH", "BC") as string,
            childId: child.id,
            teacherId: user.id,
            planId: plan?.id as string,
            status: "pending",

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          });
          const promiseItems = addReports.map((_) =>
            addDocData({
              nameCollect: "reportTasks",
              value: {
                reportId: result.id,
                planTaskId: _.id,
                content: _.total,

                createAt: serverTimestamp(),
                updateAt: serverTimestamp(),
              },
              metaDoc: "reports",
            })
          );

          await Promise.all(promiseItems);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    }
    navigate(`/home/${user?.id}/pending`);
    setSelectTarget("CHỜ DUYỆT");
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
          size={sizes.title}
          styles={{ fontWeight: "bold" }}
        />
        <SpaceComponent width={10} />
        <select
          onChange={(val) => handleSelectPlan(val.target.value)}
          className="form-select"
          aria-label="Default select example"
          style={{ width: "20%" }}
        >
          <option value={""}>Chọn kế hoạch tháng</option>
          {planApprovals &&
            planApprovals.map((plan, index) => (
              <option key={index} value={plan.id}>
                {plan.title}
              </option>
            ))}
        </select>
      </RowComponent>

      <div style={{ height: "90%", overflowY: "scroll" }}>
        <table className="table">
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
            {planTasks &&
              planTasks.map((_, index) => (
                <tr key={index}>
                  <th scope="row">{showTarget(_.targetId).field}</th>
                  <td>{showTarget(_.targetId).name}</td>
                  <td>{_.intervention}</td>
                  <td>{_.content}</td>
                  <td>
                    <textarea
                      onChange={(e) =>
                        handleChangeValue({
                          val: e.target.value,
                          planTaskId: _.id,
                        })
                      }
                      className="form-control"
                      placeholder="Nhập đánh giá"
                      rows={6}
                      cols={100}
                      id="floatingTextarea2"
                    ></textarea>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <RowComponent justify="flex-end" styles={{ padding: 20 }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{
            background: disable ? colors.gray : undefined,
            borderColor: disable ? colors.gray : undefined,
          }}
          onClick={disable ? undefined : handleAddReport}
        >
          {isLoading ? <SpinnerComponent /> : <>Tạo mới</>}
        </button>
      </RowComponent>
    </div>
  );
}
