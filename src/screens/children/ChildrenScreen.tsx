import { signOut } from "firebase/auth";
import { where } from "firebase/firestore";
import { Logout } from "iconsax-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardImageComponent,
  RowComponent,
  SearchComponent,
  SectionComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import { auth } from "../../firebase.config";
import { PlanModel, ReportModel } from "../../models";
import { ChildrenModel } from "../../models/ChildrenModel";
import useChildrenStore from "../../zustand/useChildrenStore";
import useUserStore from "../../zustand/useUserStore";

export default function ChildrenScreen() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { children, setChildren } = useChildrenStore();
  const [isLoading, setIsLoading] = useState(false);
  const [plansTotal, setPlansTotal] = useState<PlanModel[]>([]);
  const [reportsTotal, setReportsTotal] = useState<ReportModel[]>([]);

  const { data: data_children, loading: loading_children } =
    useFirestoreWithMetaCondition({
      key: `${user?.id}_childrenCache`,
      id: user?.id,
      metaDoc: "children",
      nameCollect: "children",
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
  const { data: data_plans, loading: loading_plans } =
    useFirestoreWithMetaCondition({
      key: "plansCache",
      metaDoc: "plans",
      id: user?.id,
      nameCollect: "plans",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });

  useEffect(() => {
    if (!loading_children) {
      setChildren(data_children as ChildrenModel[]);
    }
  }, [data_children, loading_children, setChildren]);
  useEffect(() => {
    if (!loading_reports) {
      const items = data_reports as ReportModel[];
      setReportsTotal(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_reports, loading_reports]);
  useEffect(() => {
    if (!loading_plans) {
      const items = data_plans as PlanModel[];
      setPlansTotal(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_plans, loading_plans]);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await signOut(auth);
      handleToastSuccess("Đăng xuất tài khoản thành công !");
      setIsLoading(false);
      navigate("/login", { replace: true }); // <-- chuyển hướng rõ ràng
    } catch (error) {
      handleToastError("Đăng xuất tài khoản thất bại !");
      console.error("Error signing out:", error);
    }
  };

  if (loading_children) return <SpinnerComponent />;
  return (
    user && (
      <SectionComponent
        styles={{
          padding: "2% 6%",
          background: colors.primary,
          display: "flex",
          flex: 1,
          height: sizes.height,
        }}
      >
        <RowComponent
          styles={{
            background: colors.bacground,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: 16,
            borderRadius: 10,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              padding: 6,
              borderRadius: 10,
              background: colors.bacground,
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            {isLoading ? (
              <SpinnerComponent />
            ) : (
              <Logout size={32} color="coral" variant="Bold" />
            )}
          </div>

          <TextComponent
            text={`Cô ${user.fullName} _ ${user.position}`}
            size={sizes.title}
            styles={{ fontWeight: "bold" }}
          />
          <SpaceComponent height={6} />
          <SearchComponent
            title="Tìm trẻ"
            placeholder="Nhập tên trẻ"
            type="searchChildren"
            arrSource={data_children as ChildrenModel[]}
            onChange={(val) => setChildren(val)}
          />
          <RowComponent
            styles={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              alignItems: "flex-start",
              overflowY: widthSmall
                ? children.length > 4
                  ? "scroll"
                  : undefined
                : children.length > 10
                  ? "scroll"
                  : undefined,
            }}
          >
            {children.length > 0 &&
              children.map((_, index) => (
                <CardImageComponent
                  key={index}
                  childInfo={_}
                  link={`home/${_.id}`}
                  plansTotal={plansTotal}
                  reportsTotal={reportsTotal}
                />
              ))}
          </RowComponent>
        </RowComponent>
      </SectionComponent>
    )
  );
}
