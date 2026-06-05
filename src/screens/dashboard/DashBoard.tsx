import { orderBy, where } from "firebase/firestore";
import { Message } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import {
  Logo,
  SpinnerComponent,
} from "../../components";
import { getDocData } from "../../constants/firebase/getDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import {
  query_fields,
  query_interventions,
  query_suggests,
  query_targets,
} from "../../constants/firebase/query/Index";
import { CENTER_NAME, handleCommentTotal } from "../../constants/info";
import { useFirestoreWithMeta } from "../../constants/useFirestoreWithMeta";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import {
  CommentModel,
  FieldModel,
  InterventionModel,
  PlanModel,
  ReportModel,
  ReportSavedModel,
  TargetModel,
  UserModel,
} from "../../models";
import { CartModel } from "../../models/CartModel";
import { SuggestModel } from "../../models/SuggestModel";
import {
  useCartStore,
  useChildStore,
  useCommentStore,
  useFieldStore,
  useInterventionStore,
  usePlanStore,
  useReportSavedStore,
  useReportStore,
  useSelectNavbarStore,
  useSuggestStore,
  useTargetStore,
  useTeacherStore,
  useTotalPlanTaskStore,
  useTotalReportTaskStore,
  useUserStore,
} from "../../zustand";
import "./dashboard.css";
import UserDropdown from "./UserDropdown";

const menuItems = [
  // {
  //   label: "Tổng quan",
  //   icon: "bi-house-door-fill",
  //   tone: "yellow",
  //   navigate: "general",
  // },
  // {
  //   label: "Hồ sơ trẻ",
  //   icon: "bi-person-vcard",
  //   tone: "red",
  //   navigate: "child-profile",
  // },
  {
    navigate: "bank",
    label: "Ngân hàng mục tiêu",
    icon: "bi-bank2",
    tone: "yellow",
  },
  {
    label: "Kế hoạch can thiệp",
    icon: "bi-calendar2-week",
    tone: "red",
    navigate: "plan",
  },
  {
    label: "Báo cáo can thiệp",
    icon: "bi-clipboard2-data",
    tone: "yellow",
    navigate: "report",
  },
  {
    label: "Chờ duyệt",
    icon: "bi-clipboard-check",
    tone: "red",
    navigate: "pending",
  },
  // {
  //   label: "Hình ảnh / Video",
  //   icon: "bi-images",
  //   tone: "yellow",
  //   navigate: "media",
  // },
  {
    label: "Giỏ mục tiêu",
    icon: "bi-cart3",
    tone: "yellow",
    navigate: "cart",
  },
  // { label: "Cài đặt", icon: "bi-gear", tone: "yellow", navigate: "setting" },
];

export default function DashboardBootstrapGreen() {
  const { id } = useParams();
  const { user } = useUserStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectNavbar, setSelectNavbar } = useSelectNavbarStore();
  const { child, setChild } = useChildStore();
  const { teachers, setTeachers } = useTeacherStore(); //teachers này là của riêng đứa trẻ đó # với teachers của toàn hệ thống
  const { setTargets } = useTargetStore();
  const { setSuggests } = useSuggestStore();
  const { setFields } = useFieldStore();
  const { setInterventions } = useInterventionStore();
  const { plans, setPlans } = usePlanStore();
  const { reports, setReports } = useReportStore();
  const { setReportSaveds } = useReportSavedStore();
  const { setComments } = useCommentStore();
  const { setTotalPlanTasks } = useTotalPlanTaskStore();
  const { setTotalReportTasks } = useTotalReportTaskStore();
  const { carts, setCarts } = useCartStore();

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
    },
  );
  const { data: data_suggests, loading: loading_suggests } =
    useFirestoreWithMeta({
      key: "suggestsCache",
      query: query_suggests,
      metaDoc: "suggests",
    });
  const { data: data_interventions, loading: loading_interventions } =
    useFirestoreWithMeta({
      key: "interventions",
      query: query_interventions,
      metaDoc: "interventions",
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
  const { data: data_reportSaveds, loading: loading_reportSaveds } =
    useFirestoreWithMetaCondition({
      key: "reportSavedsCache",
      metaDoc: "reportSaveds",
      id: user?.id,
      nameCollect: "reportSaveds",
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
  const { data: data_comments, loading: loading_comments } =
    useFirestoreWithMetaCondition({
      key: "commentsCache",
      metaDoc: "comments",
      id: user?.id,
      nameCollect: "comments",
      condition: [where("childId", '==', id), orderBy('createAt', 'desc')],
    });

  useEffect(() => {
    if (!loading_comments) {
      setComments(data_comments as CommentModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_comments, loading_comments]);

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
    if (!loading_reportSaveds) {
      const items = data_reportSaveds as ReportSavedModel[];
      setReportSaveds(
        items.filter((reportSaved) => reportSaved.childId === child?.id),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_reportSaveds, loading_reportSaveds]);
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
  useEffect(() => {
    if (child) {
      getDocsData({
        nameCollect: "planTasks",
        setData: setTotalPlanTasks,
        condition: [
          where("childId", "==", child.id),
          where("teacherIds", "array-contains", user?.id),
        ],
      });
      getDocsData({
        nameCollect: "reportTasks",
        setData: setTotalReportTasks,
        condition: [
          where("childId", "==", child.id),
          where("teacherIds", "array-contains", user?.id),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child, user]);

  function Sidebar({ open, onClose, plans, reports, carts }: any) {
    const handleQuantityPending = () => {
      const items = plans
        .concat(reports)
        .filter((_: any) => _.status === "pending");
      return items;
    };

    return (
      <>
        <div
          className={`sidebar-backdrop ${open ? "show" : ""}`}
          onClick={onClose}
        />
        <aside className={`app-sidebar ${open ? "show" : ""}`}>
          <div className="sidebar-inner d-flex flex-column h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <Logo type="dashboard" />
              {/* <button
                className="btn close-menu d-lg-none"
                onClick={onClose}
                aria-label="Đóng menu"
              >
                <i className="bi bi-x-lg" />
              </button> */}
            </div>

            <nav className="nav flex-column gap-2">
              {menuItems.map((item) => (
                <Link
                  to={`${item.navigate}`}
                  onClick={() => {
                    setSelectNavbar(item.navigate)
                    onClose()
                  }}
                  key={item.label}
                  type="button"
                  className={`sidebar-link btn border-0 text-start d-flex align-items-center justify-content-between ${selectNavbar === item.navigate ? "active" : ""}`}
                >
                  <span className="d-flex align-items-center gap-3">
                    <span className={`menu-icon ${item.tone}`}>
                      <i className={`bi ${item.icon}`} />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.navigate === "pending" &&
                    handleCommentTotal(plans.concat(reports)) && (
                      <Message color={"red"} size={26} variant="Bold" />
                    )}
                  {item.navigate === "pending" && (
                    <span className="badge-pending">
                      {handleQuantityPending().length}
                    </span>
                  )}
                  {item.navigate === "cart" && (
                    <span className="badge-pending">{carts.length}</span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-4">
              <div>
                <img alt="dashboad-menu" src="/menu-background.png"/>
              </div>
              <div className="support-card text-center">
                <div className="support-icon mx-auto mb-3">
                  <i className="bi bi-heart-pulse-fill" />
                </div>
                <div className="fw-bold text-green-dark">Tuy nhỏ bé nhưng tạo nên giá trị khác biệt phi thường</div>
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  }
  function Header({ onOpenSidebar, child, teachers }: any) {
    const half = Math.ceil(teachers.length / 2);
    const leftTeachers = teachers.slice(0, half);
    const rightTeachers = teachers.slice(half);

    if (!child || !user) return <SpinnerComponent />;

    return (
      <header className="app-header sticky-top">
        <div className="container-fluid px-2 px-md-3 px-xl-5 py-2">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3 min-w-0">
              <button
                className="btn header-icon-btn"
                onClick={onOpenSidebar}
                aria-label="Mở menu"
              >
                <i className="bi bi-list fs-4" />
              </button>
            </div>

            <div className="header-center d-flex align-items-center gap-3 flex-grow-1 justify-content-center min-w-0">
              <button className="btn header-select d-flex align-items-center gap-3 text-start">
                <img
                  className="header-avatar rounded-4 flex-shrink-0"
                  src={child.avatar}
                  alt="Trẻ đang chọn"
                />

                {/* <span className="flex-grow-1 min-w-0 d-none d-md-block"> */}
                <span className="flex-grow-1 min-w-0">
                  <span className="d-block fw-bold text-dark text-truncate">
                    {child.fullName}
                  </span>
                </span>
              </button>

              <div className="header-teacher d-none d-xl-flex align-items-center gap-3">
                <div className="teacher-icon">
                  <i className="bi bi-person-hearts" />
                </div>

                <div>
                  <div className="fw-bold small text-green-dark">
                    Giáo viên phụ trách
                  </div>

                  {/* <RowComponent styles={{ alignItems: "flex-start" }}>
                    <div>
                      {teachers.length > 0 &&
                        teachers.map(
                          (teacher: UserModel, index: number) =>
                            index < 2 && (
                              <div
                                className="small text-green-muted"
                                key={index}
                              >
                                {index + 1}. {teacher.fullName}
                              </div>
                            ),
                        )}
                    </div>

                    <SpaceComponent width={20} />

                    <div>
                      {teachers.length > 0 &&
                        teachers.map(
                          (teacher: UserModel, index: number) =>
                            index >= 2 && (
                              <div
                                className="small text-green-muted"
                                key={index}
                              >
                                {index + 1}. {teacher.fullName}
                              </div>
                            ),
                        )}
                    </div>
                  </RowComponent> */}
                  <div className="d-flex flex-column flex-md-row align-items-start gap-2 gap-md-4">
                    {/* Cột trái */}
                    <div>
                      {leftTeachers.map((teacher: UserModel, index: number) => (
                        <div className="small text-green-muted" key={index}>
                          {index + 1}. {teacher.fullName}
                        </div>
                      ))}
                    </div>

                    {/* Cột phải */}
                    <div>
                      {rightTeachers.map(
                        (teacher: UserModel, index: number) => (
                          <div className="small text-green-muted" key={index}>
                            {index + 1 + leftTeachers.length}.{" "}
                            {teacher.fullName}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <UserDropdown />
            {/* <div className="d-flex align-items-center gap-2 gap-sm-3">
              <div className="user-box d-flex align-items-center gap-3">
                <img
                  className="user-avatar rounded-circle"
                  src={user.avatar}
                  alt="Giáo viên"
                />
                <div className="d-none d-md-block">
                  <div className="fw-bold text-green-dark lh-sm">
                    {user.fullName}
                  </div>
                  <div className="small text-green-muted">{user.position}</div>
                </div>
                <i className="bi bi-chevron-down text-warning-custom d-none d-md-inline" />
              </div>
            </div> */}
          </div>
        </div>
      </header>
    );
  }

  if (!user || !id) return <SpinnerComponent />;
  return (
    <>
      <div className="dashboard-shell">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          plans={plans}
          reports={reports}
          carts={carts}
        />

        <main className="app-main">
          <Header
            onOpenSidebar={() => setSidebarOpen(true)}
            child={child}
            teachers={teachers}
          />

          <Outlet />

          <footer className="app-footer px-3 px-md-4 px-xl-5 py-3">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-2 small">
              <span>© 2026 {CENTER_NAME}</span>
              <span>Phiên bản 1.0.0</span>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
