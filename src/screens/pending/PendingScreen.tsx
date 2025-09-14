import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RowComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { PlanModel } from "../../models/PlanModel";
import { ReportModel } from "../../models/ReportModel";
import usePlanStore from "../../zustand/usePlanStore";
import useReportStore from "../../zustand/useReportStore";

export default function PendingScreen() {
  const { plans } = usePlanStore();
  const { reports } = useReportStore();
  const [newPlans, setNewPlans] = useState<PlanModel[]>([]);
  const [reportsPending, setReportsPending] = useState<ReportModel[]>([]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "pending");
      setNewPlans(items);
    }
  }, [plans]);

  useEffect(() => {
    if (reports) {
      const items = reports.filter((report) => report.status === "pending");
      setReportsPending(items);
    }
  }, [reports]);

  if (!plans && !reports) return <SpinnerComponent />;
  return (
    <div style={{ width: "100%" }}>
      <RowComponent
        justify="space-around"
        styles={{
          borderBottom: "1px solid",
          borderBottomColor: colors.primaryBold,
        }}
      >
        <TextComponent
          text="Kế hoạch"
          size={26}
          styles={{ fontWeight: "bold" }}
        />
        <TextComponent
          text="Báo cáo"
          size={26}
          styles={{ fontWeight: "bold" }}
        />
      </RowComponent>

{/* ben ke hoach */}
      <RowComponent justify="space-between">
        <RowComponent
          styles={{ display: "flex", flexWrap: "wrap", width: "100%" }}
        >
          {newPlans.length > 0 &&
            newPlans.map((_, index) => (
              <Link
                key={index}
                to={"../pendingList"}
                state={{
                  title: _.title,
                  planId: _.id,
                }}
                type="button"
                className="btn "
                style={{
                  background: colors.primaryLightOpacity,
                  border: "1px solid coral",
                  fontWeight: "bold",
                  margin: 10,
                }}
              >
                {_.title}
              </Link>
            ))}
        </RowComponent>

{/* ben bao cao */}
        <RowComponent
          styles={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {reportsPending.length > 0 &&
            reportsPending.map((_, index) => (
              <Link
                key={index}
                to={"../reportList"}
                state={{
                  title: _.title,
                  reportId: _.id,
                  status: _.status
                }}
                type="button"
                className="btn "
                style={{
                  background: colors.primaryLightOpacity,
                  border: "1px solid coral",
                  fontWeight: "bold",
                  margin: 10,
                }}
              >
                {_.title}
              </Link>
            ))}
        </RowComponent>
      </RowComponent>
    </div>
  );
}
