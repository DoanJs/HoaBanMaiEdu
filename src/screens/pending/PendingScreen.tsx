import { Notification } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RowComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { PlanModel, ReportModel } from "../../models";
import { usePlanStore, useReportStore } from "../../zustand";

export default function PendingScreen() {
  const { plans } = usePlanStore();
  const { reports } = useReportStore();
  const [plansPending, setPlansPending] = useState<PlanModel[]>([]);
  const [reportsPending, setReportsPending] = useState<ReportModel[]>([]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "pending");
      setPlansPending(items);
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
    <div style={{ width: "100%", height: "100%", overflowY: "scroll" }}>
      <RowComponent
        styles={{
          borderBottom: "1px solid",
          borderBottomColor: colors.primaryBold,
        }}
      >
        <TextComponent
          text="Kế hoạch"
          size={26}
          styles={{
            fontWeight: "bold",
            display: "flex",
            width: "100%",
            padding: "0 10px",
          }}
        />
        <TextComponent
          text="Báo cáo"
          size={26}
          styles={{
            fontWeight: "bold",
            display: "flex",
            width: "100%",
            padding: "0 10px",
          }}
        />
      </RowComponent>

      <RowComponent justify="space-between">
        {/* ben ke hoach */}
        <RowComponent
          styles={{ display: "flex", flexWrap: "wrap", width: "100%" }}
        >
          {plansPending.length > 0 &&
            plansPending.map((_, index) => (
              <Link
                key={index}
                to={"../pendingList"}
                state={{
                  title: _.title,
                  planId: _.id,
                  comment: _.comment,
                }}
                type="button"
                className="btn "
                style={{
                  background: colors.primaryLightOpacity,
                  border: "1px solid coral",
                  fontWeight: "bold",
                  margin: 10,
                  position: "relative",
                }}
              >
                {_.title}
                {_.comment && (
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -10,
                      height: 20,
                      width: 20,
                      borderRadius: 100,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Notification color={colors.red} size={20} variant="Bold" />
                  </div>
                )}
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
                  status: _.status,
                  comment: _.comment,
                }}
                type="button"
                className="btn "
                style={{
                  background: colors.primaryLightOpacity,
                  border: "1px solid coral",
                  fontWeight: "bold",
                  margin: 10,
                  position: "relative",
                }}
              >
                {_.title}
                {_.comment && (
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -10,
                      height: 20,
                      width: 20,
                      borderRadius: 100,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Notification color={colors.red} size={20} variant="Bold" />
                  </div>
                )}
              </Link>
            ))}
        </RowComponent>
      </RowComponent>
    </div>
  );
}
