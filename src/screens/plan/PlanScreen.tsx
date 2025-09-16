import { AddCircle } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RowComponent,
  SearchComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";
import { usePlanStore, useSelectTargetStore } from "../../zustand";
import { PlanModel } from "../../models";

export default function PlanScreen() {
  const { setSelectTarget } = useSelectTargetStore();
  const { plans } = usePlanStore();
  const [planNews, setPlanNews] = useState<PlanModel[]>([]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === 'approved')
      setPlanNews(items);
    }
  }, [plans]);

  if (!plans) return <SpinnerComponent />;
  return (
    <div style={{ width: "100%" }}>
      <RowComponent
        justify="space-between"
        styles={{
          padding: 10,
          alignItems: "center",
          borderBottom: "1px solid",
          borderBottomColor: colors.gray,
        }}
      >
        <SearchComponent
          type="searchPlan"
          placeholder="Nhập tháng"
          title="Tìm tháng"
          onChange={(val) => setPlanNews(val)}
          arrSource={plans.filter((plan) => plan.status === 'approved')}
        />
        <Link
          to={"../bank"}
          style={{
            cursor: "pointer",
            display: "flex",
            textDecoration: "none",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setSelectTarget("NGÂN HÀNG MỤC TIÊU")}
        >
          <AddCircle size={30} color={colors.primary} variant="Bold" />
          <SpaceComponent width={4} />
          <TextComponent text="Thêm mới" size={sizes.bigText} />
        </Link>
      </RowComponent>

      <RowComponent styles={{ display: "flex", flexWrap: "wrap" }}>
        {planNews.length > 0 &&
          planNews.map((_, index) => (
            <Link
              key={index}
              to={"../planList"}
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
    </div>
  );
}
