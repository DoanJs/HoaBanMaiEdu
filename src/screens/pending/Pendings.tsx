import { Message } from "iconsax-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { formatDateSearch, getCardTheme } from "../../constants/info";
import { PlanModel, ReportModel } from "../../models";
import {
  usePlanStore,
  useReportStore,
  useSelectNavbarStore,
  useTeacherStore,
} from "../../zustand";
import "./pending.css";

export default function PendingApprovalBootstrapGreen() {
  const [keyword, setKeyword] = useState("");
  const { plans } = usePlanStore();
  const { reports } = useReportStore();
  const [plansPending, setPlansPending] = useState<PlanModel[]>([]);
  const [reportsPending, setReportsPending] = useState<ReportModel[]>([]);
  const { teachers } = useTeacherStore();
  const { setSelectNavbar } = useSelectNavbarStore();

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);

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

  const filteredItems = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return plansPending.concat(reportsPending).filter((item: any) => {
      const teacherName = teacherMap[item.authorId]?.fullName || "";

      const createdTime = formatDateSearch(item.createAt);
      const updatedTime = formatDateSearch(item.updateAt);

      const content = `
        ${item.title ?? ""}
        ${item.id ?? ""}
        ${teacherName}
        ${createdTime}
        ${updatedTime}
      `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [plansPending, reportsPending, keyword, teacherMap]);

  function PendingCard({ item }: any) {
    const theme = getCardTheme(item.id);

    return (
      <Link
        to={item.type === "BC" ? "../reportdetail" : "../plandetail"}
        onClick={() => setSelectNavbar("")}
        state={item.type === "BC" ? { report: item } : { plan: item }}
        className="position-relative cursor-pointer text-decoration-none mb-2 mt-2"
      >
        <div className="board-kh-badge">
          <img src={theme.icon} alt="" className="board-kh-badge-img" />
        </div>

        <div className="board-paper-card" style={{ background: theme.bg }}>
          <div className="board-card-header">
            <div className="board-card-type" style={{ color: theme.color }}>
              {item.type} {item.title}
            </div>

            <span className="pending-badge flex-shrink-0">
              <i className="bi bi-hourglass-split me-1" />
              Chờ duyệt
            </span>
          </div>

          <div className="board-info-row">
            <span className="board-info-icon">
              <i className="bi bi-person-check-fill me-1 icon-red" />
            </span>
            <div>
              <div>Giáo viên thực hiện:</div>
              <div className="board-kh-footer">
                <div className="board-teacher-box">
                  <img
                    className="board-avatar"
                    src={teacherMap[item.authorId]?.avatar}
                    alt=""
                  />
                  <span>{teacherMap[item.authorId]?.fullName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="board-info-row">
            <span className="board-info-icon">
              <i className="bi bi-send-check-fill icon-yellow" />
            </span>
            <div>
              <div>Ngày gửi:&ensp;</div>
              <strong>
                {typeof item?.createAt === "number"
                  ? moment(item?.createAt).format("HH:mm:ss DD/MM/YYYY")
                  : moment(handleTimeStampFirestore(item?.createAt)).format(
                    "HH:mm:ss DD/MM/YYYY",
                  )}
              </strong>
            </div>
          </div>
          {item.comment && (
            <div className="fw-bold text-danger fst-italic">
              <Message color="red" size={26} variant="Bold" className="me-2" />
              Có nhận xét
            </div>
          )}

          <div className={`board-decor ${item.decor}`}>
            {item.type === "BC" ? "🌸" : "🌿"}
          </div>
        </div>
      </Link>
    );
  }

  if (!plans && !reports) return <SpinnerComponent />;
  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <h2 className="page-title fw-black text-green-dark mb-2">
              Chờ duyệt
            </h2>
            <p className="fs-6 text-green-muted mb-0">
              Kế hoạch và báo cáo đang chờ admin kiểm tra, duyệt hoặc trả về
              chỉnh sửa.
            </p>
          </div>
        </div>

        <div className="page-panel p-3 p-md-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-12">
              <div className="search-box">
                <i className="bi bi-search" />
                <input
                  className="form-control search-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm tên KH/BC; Gv, thời gian thực hiện"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="approval-board">
          <div className="approval-board-content">
            {filteredItems.length === 0 ? (
              <div className="page-panel p-5 text-center text-green-muted">
                <i className="bi bi-search fs-1 d-block mb-3 icon-yellow" />
                Không có mục nào đang chờ duyệt.
              </div>
            ) : (
              <div className="row g-3 g-xl-4 justify-content-center">
                {filteredItems.map((item) => (
                  <div className="col-12 col-lg-6" key={item.id}>
                    <PendingCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
