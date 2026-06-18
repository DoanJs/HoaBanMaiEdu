import { signOut } from "firebase/auth";
import { where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { indexedDBName } from "../../constants/info";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import { auth } from "../../firebase.config";
import { ChildrenModel, PlanModel, ReportModel } from "../../models";
import { useChildrenStore, useUserStore } from "../../zustand";
import "./children.css";

function StudentCard({
  student,
  isNotification,
}: {
  student: ChildrenModel;
  isNotification: boolean;
}) {
  return (
    <Link to={student.status === "paused" ? "#" : `home/${student.id}`}>
      <button type="button" className="student-card text-start">
        <div className="student-image-wrap">
          <img
            src={student.avatar}
            alt={student.fullName}
            className="student-image"
          />
          {/* Overlay khi tạm dừng */}
          {student.status && student.status === "paused" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 30 }}>🔒</div>

              <b className="text-white">Tạm dừng</b>
            </div>
          )}
          {isNotification && (
            <span className="student-bell" title="Có mục chờ xử lý">
              <i className="bi bi-bell-fill" />
            </span>
          )}
          {/* <span className="student-code">{student.id}</span> */}
        </div>
        <div className="student-body">
          <div className="student-name" title={student.id}>
            {student.fullName}
          </div>
        </div>
      </button>
    </Link>
  );
}

export default function HomeStudentsBootstrapGreen() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { children, setChildren } = useChildrenStore();
  const [plansTotal, setPlansTotal] = useState<PlanModel[]>([]);
  const [reportsTotal, setReportsTotal] = useState<ReportModel[]>([]);
  const [showNotificationOnly, setShowNotificationOnly] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

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
  // ------test----
  // const { data: data_fields, loading } = useFirestoreWithMeta({
  //     key: "fieldsCache",
  //     query: query_fields,
  //     metaDoc: "fields",
  //   });

  //   const { data: data_targets, loading: loading_targets } = useFirestoreWithMeta(
  //     {
  //       key: "targetsCache",
  //       query: query_targets,
  //       metaDoc: "targets",
  //     },
  //   );
  //   const { data: data_suggests, loading: loading_suggests } =
  //     useFirestoreWithMeta({
  //       key: "suggestsCache",
  //       query: query_suggests,
  //       metaDoc: "suggests",
  //     });

  //     console.log('data_fields: ', data_fields)
  //     console.log('data_targets: ', data_targets)
  //     console.log('data_suggests: ', data_suggests)
  // --------test ---

  useEffect(() => {
    if (!loading_children) {
      setChildren(data_children as ChildrenModel[]);
    }
  }, [data_children, loading_children]);
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

  const pendingChildIds = useMemo(() => {
    return new Set(
      plansTotal
        .concat(reportsTotal)
        .filter((item) => item.status === "pending")
        .map((item) => item.childId),
    );
  }, [plansTotal, reportsTotal]);

  const filteredStudents = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return children.filter((student) => {
      const content = `${student.fullName}`.toLowerCase();
      const matchKeyword = !search || content.includes(search);

      if (showNotificationOnly) {
        return matchKeyword && pendingChildIds.has(student.id);
      }

      return matchKeyword;
    });
  }, [keyword, children, pendingChildIds, showNotificationOnly]);

  const clearIndexedDB = () => {
    return new Promise((resolve: any, reject) => {
      const request = indexedDB.deleteDatabase(indexedDBName);

      request.onsuccess = () => {
        console.log("IndexedDB deleted");
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error deleting IndexedDB", event);
        reject();
      };

      request.onblocked = () => {
        console.warn("Delete blocked (close other tabs)");
      };
    });
  };
  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await signOut(auth);

      // ✅ clear cache IndexedDB
      await clearIndexedDB();

      handleToastSuccess("Đăng xuất tài khoản thành công !");
      navigate("/login", { replace: true });
    } catch (error) {
      handleToastError("Đăng xuất tài khoản thất bại !");
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------test add data-----------------
  // const addDataToFirebase = async () => {
  //   //   const dataCNXH = targetsCNXH.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: 'XV4FJbN7cv4UXpN2tOqR',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })
  //   //   const dataKNBC = targetsKNBC.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: 'jOdWy1TwAzuEy1lRXT7i',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })
  //   //   const dataKNC = targetsKNC.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: 'gxZsB2xYu0IiJel5Ni5z',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })
  //   //   const dataKNXH= targetsKNXH.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: 'ZeOjbxP7naiU0pAAK6q2',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })
  //   //   const dataNNDD = targetsNNDD.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: '0RptPhhmbwDhyXFstiet',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })
  //   //   const dataNNH = targetsNNH.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: 'VwWwTwTaRGrvnjIgFq1y',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })
  //   //   const dataNT = targetsNT.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: 'Jr5TN0Q2XH1zOGN9oT1f',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })
  //   //   const dataTTCY = targetsTTCY.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: 'r34oZoUXxuOq8FBEQkf8',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })
  //   //   const dataVDT = targetsVDT.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: '7GDprhycm7vmjdbuDiny',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })
  //   //   const dataVDTho = targetsVDTho.map((_) => {
  //   //     return {
  //   //       ..._,
  //   //       fieldId: 'EvH8IShW7sUs0ojOHrfo',
  //   //       createAt: serverTimestamp(),
  //   //       updateAt: serverTimestamp(),
  //   //     }
  //   //   })

  //   //   const datas = [
  //   //     ...dataCNXH,
  //   //     ...dataKNBC,
  //   //     ...dataKNC,
  //   //     ...dataKNXH,
  //   //     ...dataNNDD,
  //   //     ...dataNNH,
  //   //     ...dataNT,
  //   //     ...dataTTCY,
  //   //     ...dataVDT,
  //   //     ...dataVDTho
  //   //   ]
  //   //   // const promiseItems = datas.map((_) => addDocData({
  //   //   //   nameCollect: 'targets',
  //   //   //   value: _,
  //   //   //   metaDoc: 'targets'
  //   //   // }))

  //   //   // await Promise.all(promiseItems)
  //   //   console.log('Completed')

  //   const promiseItems = dataMatching.map((item) =>
  //     setDoc(doc(db, "targets", item.id), {
  //       ...item,
  //       createAt: serverTimestamp(),
  //       updateAt: serverTimestamp(),
  //     }),
  //   );

  //   await Promise.all(promiseItems);
  //   console.log('completed')
  // };

  // ------------------test add data-----------------
  if (loading_children) return <SpinnerComponent />;
  return (
    <>
      {user && (
        <div className="home-shell">
          <main className="home-panel">
            <header className="home-header">
              {/* <div className="d-flex align-items-center justify-content-between flex-wrap"> */}
              <div className="d-flex">
                {/* <Logo type="children" /> */}
                <div className="text-center flex-grow-1 w-100 w-lg-auto">
                  <div className="d-flex justify-content-center">
                    <img
                      className="director-avatar"
                      src={user?.avatar || "./QXEdu-icon.png"}
                      alt="avatar"
                    />
                  </div>
                  <h1 className="director-title h5 mb-1">
                    Cô {user.fullName} _ {user.position}
                  </h1>
                  {/* <div className="director-role">
                    Chọn trẻ để xem hồ sơ, kế hoạch và báo cáo can thiệp
                  </div> */}
                </div>
                <button
                  className="logout-btn"
                  aria-label="Đăng xuất"
                  title="Đăng xuất"
                  onClick={() => setShowLogout(true)}
                >
                  <i className="bi bi-box-arrow-right" />
                </button>

                {/* <button onClick={addDataToFirebase}>Add data</button> */}
              </div>
            </header>

            <section className="content-area">
              {/* <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
                <div>
                  <h2 className="page-title mb-1">Danh sách trẻ</h2>
                  <div className="fs-6 text-green-muted fw-semibold">
                    Tổng quan nhanh danh sách trẻ đang can thiệp tại trung tâm.
                  </div>
                </div>
              </div> */}

              <div className="search-panel mb-4">
                <div className="row g-3 align-items-center">
                  <div className="col-12 col-lg-9">
                    <div className="search-box">
                      <i className="bi bi-search" />
                      <input
                        className="form-control search-input"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Nhập tên trẻ, biệt danh, mã hồ sơ..."
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-3 d-flex justify-content-lg-end gap-2">
                    <div className="d-flex gap-2 flex-wrap me-3">
                      <span className="stat-pill yellow">
                        <i className="bi bi-people-fill" />
                        {children.length} trẻ
                      </span>
                      <span
                        className="stat-pill red"
                        onClick={() => setShowNotificationOnly((prev) => !prev)}
                      >
                        <i className="bi bi-bell-fill" />
                        {
                          plansTotal
                            .concat(reportsTotal)
                            .filter((_) => _.status === "pending").length
                        }
                        {showNotificationOnly && <span>Tất cả trẻ</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {filteredStudents.length > 0 ? (
                <div className="students-grid">
                  {[...filteredStudents].map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      isNotification={pendingChildIds.has(student.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i
                    className="bi bi-search fs-1 d-block mb-3"
                    style={{ color: "var(--yellow)" }}
                  />
                  Không tìm thấy trẻ phù hợp.
                </div>
              )}
            </section>
          </main>
        </div>
      )}

      {showLogout && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            {/* Title */}
            <h5 className="fw-black text-danger mb-2">Xác nhận đăng xuất</h5>

            {/* Description */}
            <p className="text-green-muted small">
              Cô chắc chắn muốn đăng xuất khỏi thiết bị này ?
            </p>

            {/* Actions */}
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button
                className="btn action-btn-soft"
                onClick={() => setShowLogout(false)}
              >
                Huỷ
              </button>

              <button className="btn action-btn-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <LoadingOverlay show={isLoading} />
    </>
  );
}
