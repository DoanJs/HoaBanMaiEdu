import { Message, Notification } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RowComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
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
    <div style={{ width: "100%", height: "100%" }}>
      <RowComponent
        styles={{
          borderBottom: "1px solid",
          borderBottomColor: colors.primaryBold,
          paddingTop: 8,
        }}
      >
        <TextComponent
          text="KẾ HOẠCH"
          size={widthSmall ? sizes.bigText : sizes.title}
          styles={{
            fontWeight: "bold",
            display: "flex",
            width: "100%",
            padding: "0 10px",
          }}
        />
        <TextComponent
          text="BÁO CÁO"
          size={widthSmall ? sizes.bigText : sizes.title}
          styles={{
            fontWeight: "bold",
            display: "flex",
            width: "100%",
            padding: "0 10px",
          }}
        />
      </RowComponent>

      <RowComponent justify="space-between" styles={{ maxHeight: '90%', alignItems: 'flex-start', overflowY: "scroll" }}>
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
                style={{
                  background: colors.primaryLightOpacity,
                  border: "1px solid coral",
                  fontWeight: "bold",
                  margin: 10,
                  position: "relative",
                  borderRadius: 4,
                  padding: 8,
                  textDecoration: "none",
                }}
              >
                <TextComponent
                  text={_.title}
                  size={widthSmall ? sizes.text : sizes.thinTitle}
                />
                {_.comment && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      height: 20,
                      width: 20,
                      borderRadius: 100,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Message color={colors.red} size={20} variant="Bold" />
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
                  padding: 8,
                  borderRadius: 4,
                  position: "relative",
                }}
              >
                <TextComponent
                  text={_.title}
                  size={widthSmall ? sizes.text : sizes.thinTitle}
                />
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
                    <Message color={colors.red} size={20} variant="Bold" />
                  </div>
                )}
              </Link>
            ))}
        </RowComponent>
      </RowComponent>
    </div>
  );
}
