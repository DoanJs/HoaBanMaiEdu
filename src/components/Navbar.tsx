import { where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import {
  HomeItemComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from ".";
import { colors } from "../constants/colors";
import { getDocData } from "../constants/firebase/getDocData";
import { getDocsData } from "../constants/firebase/getDocsData";
import {
  query_fields,
  query_interventions,
  query_suggests,
  query_targets,
} from "../constants/firebase/query/Index";
import { widthSmall } from "../constants/reponsive";
import { sizes } from "../constants/sizes";
import { useFirestoreWithMeta } from "../constants/useFirestoreWithMeta";
import { useFirestoreWithMetaCondition } from "../constants/useFirestoreWithMetaCondition";
import {
  FieldModel,
  InterventionModel,
  PlanModel,
  ReportModel,
  TargetModel,
  UserModel,
} from "../models";
import { SuggestModel } from "../models/SuggestModel";
import {
  useCartStore,
  useChildStore,
  useFieldStore,
  useInterventionStore,
  usePlanStore,
  useReportStore,
  useSelectTargetStore,
  useSuggestStore,
  useTargetStore,
  useUserStore,
} from "../zustand";
import { CartModel } from "../models/CartModel";

export default function Navbar() {
  const { id } = useParams();
  const { user } = useUserStore();
  const { selectTarget, setSelectTarget } = useSelectTargetStore();
  const { child, setChild } = useChildStore();
  const [teachers, setTeachers] = useState<UserModel[]>([]);
  const { setTargets } = useTargetStore();
  const { setSuggests } = useSuggestStore();
  const { setFields } = useFieldStore();
  const { setPlans } = usePlanStore();
  const { setReports } = useReportStore();
  const { setInterventions } = useInterventionStore();
  const {setCarts} = useCartStore()

  const { data: data_fields, loading } = useFirestoreWithMeta({
    key: "fieldsCache",
    query: query_fields,
    metaDoc: "fields",
  });
  const { data: data_targets, loading: loading_targets } = useFirestoreWithMeta(
    {
      key: "targetsCache",
      query: query_targets,
      metaDoc: "targets",
    }
  );
  const { data: data_suggests, loading: loading_suggests } =
    useFirestoreWithMeta({
      key: "suggestsCache",
      query: query_suggests,
      metaDoc: "suggests",
    });
  const { data: data_plans, loading: loading_plans } =
    useFirestoreWithMetaCondition({
      key: "plansCache",
      metaDoc: "plans",
      id: user?.id,
      nameCollect: "plans",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });
  const { data: data_carts, loading: loading_carts } =
    useFirestoreWithMetaCondition({
      key: "cartsCache",
      metaDoc: "carts",
      id: user?.id,
      nameCollect: "carts",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });
  const { data: data_reports, loading: loading_reports } =
    useFirestoreWithMetaCondition({
      key: "reportsCache",
      metaDoc: "reports",
      id: user?.id,
      nameCollect: "reports",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });
  const { data: data_interventions, loading: loading_interventions } =
    useFirestoreWithMeta({
      key: "interventions",
      query: query_interventions,
      metaDoc: "interventions",
    });

  useEffect(() => {
    if (!loading_interventions) {
      setInterventions(data_interventions as InterventionModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_interventions, loading_interventions]);
  useEffect(() => {
    if (!loading_reports) {
      const items = data_reports as ReportModel[];
      setReports(items.filter((plan) => plan.childId === child?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_reports, loading_reports]);
  useEffect(() => {
    if (!loading_plans) {
      const items = data_plans as PlanModel[];
      setPlans(items.filter((plan) => plan.childId === child?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_plans, loading_plans]);
  useEffect(() => {
    if (!loading_carts) {
      const items = data_carts as CartModel[];
      setCarts(items.filter((cart) => cart.childId === child?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_carts, loading_carts]);
  useEffect(() => {
    if (!loading) {
      setFields(data_fields as FieldModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_fields, loading]);
  useEffect(() => {
    if (!loading_targets) {
      setTargets(data_targets as TargetModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_targets, loading_targets]);
  useEffect(() => {
    if (!loading_suggests) {
      setSuggests(data_suggests as SuggestModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_suggests, loading_suggests]);
  useEffect(() => {
    if (id) {
      getDocData({
        id,
        nameCollect: "children",
        setData: setChild,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if (child) {
      getDocsData({
        nameCollect: "users",
        condition: [where("id", "in", child.teacherIds)],
        setData: setTeachers,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child]);

  if (!user) return <SpinnerComponent />;
  return (
    <SectionComponent
      styles={{
        padding: "1%",
        background: colors.primary,
        display: "flex",
        flex: 1,
        height: sizes.height,
      }}
    >
      <div
        style={{
          flex: 1,
          background: colors.primaryLight,
          padding: "1%",
          borderRadius: 10,
        }}
      >
        <RowComponent justify="space-between">
          <RowComponent>
            <Link to={"/"}>
              <img
                alt=""
                src="https://res.cloudinary.com/filesuploadonserver/image/upload/v1757600460/HoaBanMaiEdu/icons/HBMIcon_ujnyvq.jpg"
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 10,
                }}
              />
            </Link>
            <SpaceComponent width={10} />
            <TextComponent
              text="TRUNG TÂM CAN THIỆP SỚM HOA BAN MAI EDU"
              styles={{ fontWeight: "bold" }}
              size={widthSmall ? sizes.bigText : sizes.thinTitle}
            />
          </RowComponent>

          <RowComponent>
            <RowComponent
              styles={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                alt=""
                src={child?.avatar}
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 100,
                  objectFit: "cover",
                }}
              />
              <SpaceComponent width={4} />
              <TextComponent
                text={child?.fullName as string}
                styles={{ fontWeight: "bold" }}
                size={sizes.text}
              />
            </RowComponent>
            <SpaceComponent width={10} />
            <div
              style={{
                borderLeft: "1px solid",
                borderLeftColor: colors.primary,
                paddingLeft: 10,
              }}
            >
              <TextComponent
                text="Giáo viên phụ trách:"
                styles={{ fontWeight: "bold" }}
                size={sizes.text}
              />
              <RowComponent styles={{alignItems:'flex-start'}}>
                <div>
                  {teachers.length > 0 &&
                    teachers.map((teacher, index) =>  index < 2 &&(
                      <TextComponent
                        key={index}
                        text={`${index + 1}. ${teacher.fullName}`}
                      />
                    ))}
                </div>
                <SpaceComponent width={20}/>
                <div>
                  {teachers.length > 0 && 
                    teachers.map((teacher, index) => index >= 2 && (
                      <TextComponent
                        key={index}
                        text={`${index + 1}. ${teacher.fullName}`}
                      />
                    ))}
                </div>
              </RowComponent>
            </div>
          </RowComponent>

          <RowComponent>
            <RowComponent styles={{ flexDirection: "column" }}>
              <TextComponent
                text={user?.fullName.toUpperCase() as string}
                color={colors.textBold}
                size={sizes.text}
                styles={{ fontWeight: "bold" }}
              />
              <TextComponent
                text={user?.position as string}
                color={colors.textBold}
              />
            </RowComponent>
            <SpaceComponent width={6} />
            <Link to={"profile"} onClick={() => setSelectTarget("")}>
              <img
                alt=""
                src={user?.avatar}
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 100,
                  cursor: "pointer",
                  objectFit: "cover",
                }}
              />
            </Link>
          </RowComponent>
        </RowComponent>

        <SpaceComponent height={4} />

        <RowComponent
          styles={{
            flex: 1,
            alignItems: "flex-start",
            borderRadius: 10,
            height: "89%",
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <RowComponent
              styles={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <RowComponent
                styles={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <HomeItemComponent
                  title="NGÂN HÀNG MỤC TIÊU"
                  icon="bank"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                <HomeItemComponent
                  title="KẾ HOẠCH"
                  icon="plan"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                <HomeItemComponent
                  title="BÁO CÁO"
                  icon="chart"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                <HomeItemComponent
                  title="CHỜ DUYỆT"
                  icon="pending"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                {/* <HomeItemComponent
                  title="ĐIỂM DANH"
                  icon="callover"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                /> */}
                <HomeItemComponent
                  title="HÌNH ẢNH/VIDEO"
                  icon="image"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                <HomeItemComponent
                  title="CÀI ĐẶT"
                  icon="setting"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
              </RowComponent>

              <HomeItemComponent
                title="GIỎ MỤC TIÊU"
                icon="cart"
                value={selectTarget}
                onClick={(val) => setSelectTarget(val)}
              />
            </RowComponent>
          </div>

          <SectionComponent
            styles={{
              display: "flex",
              flex: 4,
              background: colors.bacground,
              borderRadius: 10,
              height: "100%",
            }}
          >
            <Outlet />
          </SectionComponent>
        </RowComponent>
      </div>
    </SectionComponent>
  );
}
