import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { formatDateSearch, getCardTheme } from "../../constants/info";
import { PlanModel } from "../../models";
import {
  usePlanStore,
  useSelectNavbarStore,
  useTeacherStore,
} from "../../zustand";
import "./plan.css";

export default function ApprovedPlansBootstrapGreen() {
  const [keyword, setKeyword] = useState("");
  const { setSelectNavbar } = useSelectNavbarStore();
  const { plans } = usePlanStore();
  const [planNews, setPlanNews] = useState<PlanModel[]>([]);
  const { teachers } = useTeacherStore();

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "approved");
      setPlanNews(items);
    }
  }, [plans]);

  const filteredPlans = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return planNews.filter((item: any) => {
      const teacherName = teacherMap[item.authorId]?.fullName || "";

      const createdTime = formatDateSearch(item.createAt);
      const updatedTime = formatDateSearch(item.updateAt);

      const content = `
      ${item.title ?? ""}
      ${teacherName}
      ${createdTime}
      ${updatedTime}
    `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [planNews, keyword, teacherMap]);

  function PlanCard({ plan }: any) {
    const theme = getCardTheme(plan.id);
    return (
      <Link
        to="../plandetail"
        onClick={() => setSelectNavbar("")}
        state={{ plan }} className="container-fluid py-4 text-decoration-none cursor-pointer">
        <div className="plan-kh-badge">
          <img
            src={theme.icon}
            alt=""
            className="plan-kh-badge-img"
          />
        </div>
        <div
          className="plan-kh-card"
          style={{ background: theme.bg }}
        >


          <div className="plan-kh-glass" />
          <div className="d-flex justify-content-between align-items-start">
            <div
              className="plan-kh-title"
              style={{ color: theme.color }}
            >
              {plan.type} {plan.title}
            </div>

            <span className="status-approved flex-shrink-0">
              <i className="bi bi-patch-check-fill me-1" />
              {plan.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
            </span>
          </div>


          <div className="plan-kh-info">
            <i className="bi bi-send-check-fill icon-yellow" /> Ngày tạo:&ensp;
            {typeof plan?.createAt === "number"
              ? moment(plan?.createAt).format("HH:mm:ss DD/MM/YYYY")
              : moment(handleTimeStampFirestore(plan?.createAt)).format(
                "HH:mm:ss DD/MM/YYYY",
              )}
          </div>

          <div className="plan-kh-info">
            <i className="bi bi-calendar-heart icon-red" /> Ngày duyệt:&ensp;
            {typeof plan?.updateAt === "number"
              ? moment(plan?.updateAt).format("HH:mm:ss DD/MM/YYYY")
              : moment(handleTimeStampFirestore(plan?.updateAt)).format(
                "HH:mm:ss DD/MM/YYYY",
              )}
          </div>

          <div className="plan-kh-info">
            <i className="bi bi-person-check-fill me-1 icon-red" /> Gv thực hiện :
          </div>

          <div className="plan-kh-footer">
            <div className="plan-teacher-box">
              <img
                className="plan-avatar"
                src={teacherMap[plan.authorId]?.avatar || '/HBMEdu-icon-192x192.png'}
                alt="avatar"
              />
              <span>
                {teacherMap[plan.authorId]?.fullName}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (!plans) return <SpinnerComponent />;

  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4 mb-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <h2 className="page-title fw-black text-green-dark mb-2">
              Kế hoạch can thiệp
            </h2>
            <p className="fs-6 text-green-muted mb-0">
              ( Dùng để trích xuất và làm báo cáo )
            </p>
          </div>
          <div className="col-12 col-lg-auto d-flex gap-2 flex-wrap">
            <Link
              to={"../cart"}
              onClick={() => setSelectNavbar("cart")}
              className="btn action-btn-primary"
            >
              <i className="bi bi-plus-circle-fill me-2" />
              Tạo kế hoạch mới
            </Link>

            <Link
              to={"../addreport"}
              onClick={() => setSelectNavbar("")}
              className="btn action-btn-primary flex-fill"
            >
              <i className="bi bi-pencil-square me-2" />
              Làm báo cáo
            </Link>
          </div>
        </div>

        <div className="page-panel p-3 p-md-4 mb-2">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-12">
              <div className="search-box">
                <i className="bi bi-search" />
                <input
                  className="form-control search-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm tên KH; Gv, thời gian thực hiện"
                />
              </div>
            </div>
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="page-panel p-5 text-center text-green-muted">
            <i className="bi bi-search fs-1 d-block mb-3 icon-yellow" />
            Không tìm thấy kế hoạch phù hợp.
          </div>
        ) : (
          <div className="row g-3 g-xl-4">
            {filteredPlans.map((plan) => (
              <div key={`${plan.id}`} className="col-12 col-sm-6 col-lg-4 col-xl-3 position-relative">
                <PlanCard plan={plan} key={plan.id} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}