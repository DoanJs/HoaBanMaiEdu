import { serverTimestamp, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import { addDocData } from "../../constants/firebase/addDocData";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { activeCategoryDefault, fieldOrder } from "../../constants/info";
import { showUIIconTarget } from "../../constants/showUIIconTarget";
import { PlanTaskModel, ReportTaskModel, TargetModel } from "../../models";
import { CartModel } from "../../models/CartModel";
import {
  useCartStore,
  useChildStore,
  useFieldStore,
  usePlanTaskStore,
  useSelectNavbarStore,
  useTargetStore,
  useTotalPlanTaskStore,
  useTotalReportTaskStore,
  useUserStore,
} from "../../zustand";
import "./bank.css";

type LevelMap = Record<number, any[]>; // 1 | 2 | 3 | 4

function CategoryCard({
  category,
  active,
  onClick,
  targets,
  totalReportTasks,
  totalPlanTasks,
  selectedIds,
}: any) {
  function calculateProgressPercent(
    baseLevels: LevelMap, // A
    reportLevels: LevelMap, // B
  ): number {
    const getRatio = (level: number) => {
      const baseCount = baseLevels[level]?.length || 0;
      const reportCount = reportLevels[level]?.length || 0;

      if (baseCount === 0) return 0;
      return reportCount / baseCount;
    };

    if (reportLevels[4]?.length) {
      return 75 + getRatio(4) * 25;
    }

    if (reportLevels[3]?.length) {
      return 50 + getRatio(3) * 25;
    }

    if (reportLevels[2]?.length) {
      return 25 + getRatio(2) * 25;
    }

    if (reportLevels[1]?.length) {
      return getRatio(1) * 25;
    }

    return 0;
  }
  const getLevelMapFromTargets = (targetIds: string[], fieldId: string) => {
    const targetIdSet = new Set(targetIds);

    const levelMap: Record<number, TargetModel[]> = {};

    for (const target of targets) {
      // 1️⃣ chỉ lấy target có id nằm trong report
      if (!targetIdSet.has(target.id)) continue;

      // 2️⃣ đúng field
      if (target.fieldId !== fieldId) continue;

      // 3️⃣ gom theo level
      (levelMap[target.level] ||= []).push(target);
    }

    return levelMap;
  };
  const getTargetIdsFromReportTasks = (
    reportTasks: ReportTaskModel[],
    planTasks: PlanTaskModel[],
  ): string[] => {
    // Map tra nhanh planTaskId → targetId
    const planTaskTargetMap = new Map<string, string>(
      planTasks.map((pt) => [pt.id, pt.targetId]),
    );

    const targetIdSet = new Set<string>();

    for (const rt of reportTasks) {
      const targetId = planTaskTargetMap.get(rt.planTaskId);
      if (targetId) {
        targetIdSet.add(targetId);
      }
    }

    return Array.from(targetIdSet);
  };
  const selectedCountByField = useMemo(() => {
    const countMap: Record<string, number> = {};

    targets.forEach((target: TargetModel) => {
      if (selectedIds.has(target.id)) {
        const fieldId = target.fieldId;

        if (!countMap[fieldId]) {
          countMap[fieldId] = 0;
        }

        countMap[fieldId] += 1;
      }
    });

    return countMap;
  }, [targets, selectedIds]);
  const baseLevels = getLevelMapFromTargets(
    targets.map((_: any) => _.id),
    category.id,
  );
  const reportLevels = getLevelMapFromTargets(
    getTargetIdsFromReportTasks(totalReportTasks, totalPlanTasks),
    category.id,
  );
  return (
    <button
      type="button"
      className={`category-card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="category-icon">
        {/* <i className={`bi ${showUIIconTarget(category.name)}`} /> */}
        <img
          src={`/icons/${showUIIconTarget(category.name)}`}
          alt={category.name}
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      </div>
      <div className="category-name">{category.name}</div>
      <div className="d-flex align-items-center justify-content-between small mt-3">
        <span className="text-green-muted">
          {targets.filter((_: any) => _.fieldId === category.id).length} mục
          tiêu
        </span>
        <span className="selected-count">
          {selectedCountByField[category.id] ?? 0} đã chọn
        </span>
      </div>
      <div
        className="progress category-progress mt-2"
        role="progressbar"
        aria-valuenow={Number(
          calculateProgressPercent(baseLevels, reportLevels).toFixed(2),
        )}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar"
          style={{
            width: `${Number(calculateProgressPercent(baseLevels, reportLevels).toFixed(2))}%`,
          }}
        />
      </div>
      <div className="text-end small fw-bold text-green-dark mt-1">
        {Number(calculateProgressPercent(baseLevels, reportLevels).toFixed(2))}%
      </div>
    </button>
  );
}


export default function GoalBankBootstrapGreen() {
  const { setSelectNavbar } = useSelectNavbarStore();
  const [activeCategory, setActiveCategory] = useState(activeCategoryDefault);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { user } = useUserStore();
  const { fields } = useFieldStore();
  const { targets } = useTargetStore();
  const { totalPlanTasks } = useTotalPlanTaskStore();
  const { totalReportTasks } = useTotalReportTaskStore();
  const { carts, removeCart, addCart } = useCartStore();
  const { planTasks, setPlanTasks } = usePlanTaskStore();
  const { child } = useChildStore();

  const selectedIds = useMemo(() => {
    return new Set(carts.map((cart: CartModel) => cart.targetId));
  }, [carts]);

  useEffect(() => {
    if (id) {
      getDocsData({
        nameCollect: "planTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("childId", "==", id),
        ],
        setData: setPlanTasks,
      });
    }
  }, [id]);

  const activeCategoryInfo = useMemo(() => {
    if (!fields.length) return null;
    return fields.find((item) => item.id === activeCategory) || null;
  }, [fields, activeCategory]);

  const filteredGoals = useMemo(() => {
    if (!targets.length) return [];

    const search = keyword.trim().toLowerCase();

    return targets.filter((target) => {
      const matchCategory = target.fieldId === activeCategory;

      const matchSearch =
        !search ||
        `${target.name ?? ""} Level: ${String(target.level ?? "")}`
          .toLowerCase()
          .includes(search);

      return matchCategory && matchSearch;
    });
  }, [targets, activeCategory, keyword]);

  const toggleGoal = async (target: TargetModel) => {
    if (!user || !child || isLoading) return;

    const existingCart = carts.find(
      (cart: CartModel) => cart.targetId === target.id,
    );

    setIsLoading(true);

    try {
      // ❌ ĐÃ TỒN TẠI → XÓA
      if (existingCart) {
        await deleteDocData({
          nameCollect: "carts",
          id: existingCart.id,
          metaDoc: "carts",
        });

        removeCart(existingCart.id);
        return;
      }

      // ✅ CHƯA CÓ → THÊM
      const cartValue = {
        targetId: target.id,
        level: target.level,
        name: target.name,
        fieldId: target.fieldId,

        content: target.content || "",
        intervention: "",
        childId: child.id,
        teacherIds: child.teacherIds,
        authorId: user.id,

        createAt: serverTimestamp(),
        updateAt: serverTimestamp(),
      };

      const result = await addDocData({
        nameCollect: "carts",
        value: cartValue,
        metaDoc: "carts",
      });

      addCart({
        ...cartValue,
        id: result.id,
      });
    } catch (err) {
      console.error("toggleGoal error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fields) return <SpinnerComponent />;

  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <h2 className="page-title fw-black text-green-dark mb-2">
              Ngân hàng mục tiêu
            </h2>
            <p className="fs-6 text-green-muted mb-0">
              Giáo viên tick chọn mục tiêu phù hợp để đưa vào kế hoạch tháng cho
              trẻ.
            </p>
          </div>
        </div>

        <div className="category-panel p-3 p-md-4 mb-2">
          <div className="d-flex justify-content-between align-items-end gap-3 mb-1">
            <div>
              <h3 className="h5 fw-black text-green-dark mb-1">
                Lĩnh vực mục tiêu
              </h3>
              <div className="small text-green-muted fw-semibold">
                Chọn lĩnh vực để xem mục tiêu chi tiết
              </div>
            </div>
            <div className="small fw-bold text-green-dark d-none d-md-block">
              Đang xem: {activeCategoryInfo?.name}
            </div>
          </div>
          <div className="category-scroll">
            {fields.length > 0 &&
              fields
                .sort((a, b) => {
                  // const order = [
                  //   "VwWwTwTaRGrvnjIgFq1y", // Ngôn ngữ hiểu
                  //   "0RptPhhmbwDhyXFstiet", // Ngôn ngữ diễn đạt
                  //   "Jr5TN0Q2XH1zOGN9oT1f", // Nhận thức
                  //   "7GDprhycm7vmjdbuDiny", // Vận động tinh
                  //   "EvH8IShW7sUs0ojOHrfo", // Vận động thô
                  //   "XV4FJbN7cv4UXpN2tOqR", // Cá nhân xã hội
                  //   "r34oZoUXxuOq8FBEQkf8", // Tập trung chú ý
                  //   "ZeOjbxP7naiU0pAAK6q2", // Kỹ năng xã hội
                  //   "gxZsB2xYu0IiJel5Ni5z", // Kỹ năng chơi
                  //   "jOdWy1TwAzuEy1lRXT7i", // Kỹ năng bắt chước
                  // ];
                  return fieldOrder.indexOf(a.id) - fieldOrder.indexOf(b.id);
                })
                .map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    targets={targets}
                    totalPlanTasks={totalPlanTasks}
                    totalReportTasks={totalReportTasks}
                    active={category.id === activeCategory}
                    selectedIds={selectedIds}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
          </div>
        </div>

        <div className="page-panel p-3 p-md-4 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-7">
              <div className="search-box">
                <i className="bi bi-search" />
                <input
                  className="form-control search-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm mục tiêu, mức độ (level: 1)..."
                />
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-2 text-lg-center">
              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background: "var(--green-100)",
                  color: "var(--green-800)",
                }}
              >
                <i className="bi bi-cart-check-fill me-2" />
                Đã chọn {selectedIds.size} mục tiêu
              </span>
            </div>

            {selectedIds.size > 0 && (
              <div className="col-12 col-sm-6 col-lg-3">
                <Link
                  to="../cart"
                  onClick={() => setSelectNavbar("cart")}
                  className="btn action-btn-primary w-100"
                >
                  <i className="bi bi-calendar-plus-fill me-2" />
                  Làm kế hoạch tháng
                </Link>
              </div>
            )}
          </div>
          {/* <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="search-box">
                <i className="bi bi-search" />
                <input
                  className="form-control search-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm mục tiêu, level: ..."
                />
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4 text-lg-end">
              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background: "var(--green-100)",
                  color: "var(--green-800)",
                }}
              >
                <i className="bi bi-cart-check-fill me-2" />
                Đã chọn {selectedIds.size} mục tiêu
              </span>
            </div>

            <Link
              to={"../cart"}
              onClick={() => setSelectNavbar("cart")}
              className="btn action-btn-primary w-100 mb-2"
            >
              <i className="bi bi-calendar-plus-fill me-2" />
              Làm kế hoạch tháng
            </Link>
          </div> */}
        </div>

        <div className="row g-4">
          <div className="col-12 col-xl-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="h5 fw-black text-green-dark mb-1">
                  Mục tiêu: {activeCategoryInfo?.name}
                </h3>
                <div className="small text-green-muted fw-semibold">
                  {filteredGoals.length} mục tiêu phù hợp bộ lọc
                </div>
              </div>
            </div>

            {/* <div className="row g-3">
              {filteredGoals
                .sort((a, b) => a.level - b.level)
                .map((goal) => (
                  <div className="col-12 col-lg-12" key={goal.id}>
                    <GoalCard
                      goal={goal}
                      checked={selectedIds.has(goal.id)}
                      onToggle={() => toggleGoal(goal)}
                      carts={carts}
                      planTasks={planTasks}
                    />
                  </div>
                ))}
            </div> */}

            {filteredGoals.length === 0 ? (
              <div className="page-panel p-5 text-center text-green-muted">
                <i
                  className="bi bi-search fs-1 d-block mb-3"
                  style={{ color: "var(--yellow)" }}
                />
                Không tìm thấy mục tiêu phù hợp.
              </div>
            ) : (
              <div className="goal-table-wrapper">
                <div className="table-responsive">
                  <table className="table goal-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: "100px" }} className="text-center">
                          Mức độ
                        </th>
                        <th className="text-center">Mục tiêu</th>
                        <th style={{ width: "100px" }} className="text-center">
                          Chọn
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredGoals
                        .sort((a, b) => a.level - b.level)
                        .map((goal, index) => {
                          const isSelectedTarget = planTasks.some(
                            (planTask: PlanTaskModel) =>
                              planTask.targetId === goal.id,
                          );

                          return (
                            <tr
                              key={goal.id}
                              className={
                                selectedIds.has(goal.id) ? "table-success" : ""
                              }
                            >
                              <td className="text-center">
                                <span className="badge bg-success">
                                  {goal.level}
                                </span>
                              </td>

                              <td>
                                <label
                                  htmlFor={`goal-${goal.id}`}
                                  className={`cursor-pointer mb-0 ${isSelectedTarget
                                    ? "fst-italic text-green-dark"
                                    : ""
                                    }`}
                                >
                                  {goal.name}
                                </label>
                              </td>

                              <td className="text-center">
                                <input
                                  id={`goal-${goal.id}`}
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedIds.has(goal.id)}
                                  onChange={() => toggleGoal(goal)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* <div className="col-12 col-xl-4">
            <aside className="cart-panel cart-panel-highlight p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h3 className="h5 fw-black text-green-dark mb-1">
                    Giỏ mục tiêu tháng {getCurrentMonth()}
                  </h3>
                </div>
                <span
                  className="badge rounded-pill"
                  style={{ background: "var(--red)", color: "#fff" }}
                >
                  {selectedGoals.length}
                </span>
              </div>

              {selectedGoals.length > 0 ? (
                <>
                  <div className="cart-scroll mb-3">
                    {selectedGoals.map((goal, index) => (
                      <div className="cart-item" key={goal.id}>
                        <span className="cart-index">{index + 1}</span>
                        <div className="min-w-0 flex-grow-1">
                          <div className="fw-bold text-green-dark">
                            {goal.name}
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="small text-green-muted">
                              {fields.find((_: any) => _.id === goal.fieldId)
                                ?.name ?? "Chưa rõ"}
                            </div>
                            <div className="small text-green-muted">
                              Level: {goal.level}
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm"
                          onClick={() => toggleGoal(goal)}
                          aria-label="Bỏ chọn"
                        >
                          <i
                            className="bi bi-x-circle-fill"
                            style={{ color: "var(--red)" }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={"../cart"}
                    onClick={() => setSelectNavbar("cart")}
                    className="btn action-btn-primary w-100 mb-2"
                  >
                    <i className="bi bi-calendar-plus-fill me-2" />
                    Làm kế hoạch tháng
                  </Link>
                </>
              ) : (
                <div className="empty-cart">
                  <i
                    className="bi bi-cart3 fs-1 d-block mb-2"
                    style={{ color: "var(--yellow)" }}
                  />
                  Chưa có mục tiêu nào được chọn.
                </div>
              )}
            </aside>
          </div> */}
        </div>
      </section>

      <LoadingOverlay show={isLoading} />
    </>
  );
}
