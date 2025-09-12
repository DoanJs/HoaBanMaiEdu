import { where } from "firebase/firestore";
import { AddCircle } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RowComponent, SearchComponent, SpaceComponent, SpinnerComponent, TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import { PlanModel } from "../../models/PlanModel";
import usePlanStore from "../../zustand/usePlanStore";
import useSelectTargetStore from "../../zustand/useSelectTargetStore";
import useUserStore from "../../zustand/useUserStore";
import useChildStore from "../../zustand/useChildStore";

export default function PlanScreen() {
  const { user } = useUserStore()
  const {child} = useChildStore()
  const { setSelectTarget } = useSelectTargetStore();
  const { plans, setPlans } = usePlanStore()
  const [planNews, setPlanNews] = useState<PlanModel[]>([]);

  const { data: data_plans, loading: loading_plans } = useFirestoreWithMetaCondition({
    key: 'plansCache',
    metaDoc: 'plans',
    id: user?.id,
    nameCollect: 'plans',
    condition: where('teacherId', '==', user?.id)
  })

  useEffect(() => {
    if (!loading_plans) {
      const items = data_plans as PlanModel[]
      setPlans(items.filter((plan) => plan.childId === child?.id))
    }
  }, [data_plans, loading_plans])


  useEffect(() => {
    if (plans) {
      setPlanNews(plans)
    }
  }, [plans])


  if (loading_plans) return <SpinnerComponent />
  return (
    <div style={{ width: '100%' }}>
      <RowComponent
        justify="space-between"
        styles={{
          padding: 10,
          alignItems: "center",
          borderBottom: "1px solid",
          borderBottomColor: colors.gray,
        }}
      >
        <SearchComponent type="searchPlan" placeholder="Nhập tháng" title="Tìm tháng"
          onChange={(val) => setPlanNews(val)} arrSource={plans} />
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
        {planNews.length > 0 && planNews.map((_, index) => (
          <Link
            key={index}
            to={"../planList"}
            state={{
              title: _.title,
              planId: _.id
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
