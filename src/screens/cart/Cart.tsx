import { httpsCallable } from "firebase/functions";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SpaceComponent } from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import { convertTargetField } from "../../constants/convertTargetAndField";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { getDocData } from "../../constants/firebase/getDocData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import {
  getCurrentMonth,
  getNextMonth,
  getPreviousMonth,
} from "../../constants/info";
import { functions } from "../../firebase.config";
import { PlanModel } from "../../models";
import {
  useCartEditStore,
  useCartStore,
  useChildStore,
  useFieldStore,
  useInterventionStore,
  usePlanStore,
  useSelectNavbarStore,
  useTargetStore,
  useUserStore,
} from "../../zustand";
import "./cart.css";

function GoalCartItem({ cart }: any) {
  const { fields } = useFieldStore();
  const { interventions } = useInterventionStore();
  const { targets } = useTargetStore();
  const { removeCart, editCart } = useCartStore();

  const handleSelectIntervention = (val: string) => {
    editCart(cart.id, { ...cart, intervention: val });
  };

  return (
    <tr key={cart.id}>
      <td className="area-cell">
        {convertTargetField(cart.targetId, targets, fields).nameField}
      </td>

      <td className="goal-cell" style={{ textAlign: "justify" }}>
        <div className="fw-semibold text-green-dark">{cart.name}</div>

        <div>
          <span className="goal-level">Level: {cart.level}</span>
        </div>
      </td>
      <td className="content-cell" style={{ textAlign: "justify" }}>
        {cart.content || "Chưa có mô tả cho mục tiêu này. Liên hệ Admin"}
      </td>

      <td className="support-cell">
        <select
          className="form-select"
          value={cart.intervention}
          onChange={(val) => handleSelectIntervention(val.target.value)}
        >
          <option value="">Chọn mức độ hỗ trợ</option>
          {interventions.map((_) => (
            <option value={_.name} key={_.id}>
              {_.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        <button
          className="btn remove-btn"
          onClick={() => {
            removeCart(cart.id);
            deleteDocData({
              nameCollect: "carts",
              id: cart.id,
              metaDoc: "carts",
            });
          }}
          aria-label="Xóa mục tiêu"
        >
          <i className="bi bi-trash3-fill" />
        </button>
      </td>
    </tr>
  );
}
function GoalCartCard({ cart }: any) {
  const { fields } = useFieldStore();
  const { interventions } = useInterventionStore();
  const { targets } = useTargetStore();
  const { removeCart, editCart } = useCartStore();

  const handleSelectIntervention = (val: string) => {
    editCart(cart.id, { ...cart, intervention: val });
  };

  return (
    <article className="goal-cart-card">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div className="min-w-0">
          <div className="d-flex flex-wrap gap-2 mb-2">
            <span className="goal-area">
              <i className="bi bi-flower2 me-1" />
              {convertTargetField(cart.targetId, targets, fields).nameField}
            </span>
            <span className="goal-level">Level: {cart.level}</span>
          </div>
          <h3 className="goal-title">{cart.name}</h3>
          <div className="goal-description-card">
            <div className="goal-description-label">
              <i className="bi bi-card-text me-2" />
              Mô tả
            </div>

            <div className="goal-description-content">
              {cart.content || "Chưa có mô tả cho mục tiêu này. Liên hệ Admin"}
            </div>
          </div>

          <div className="row g-2 mt-2">
            <div className="col-12 col-md-12">
              <select
                className="form-select"
                value={cart.intervention}
                onChange={(val) => handleSelectIntervention(val.target.value)}
              >
                <option value="">Chọn mức độ hỗ trợ</option>
                {interventions.map((_) => (
                  <option value={_.name} key={_.id}>
                    {_.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          className="btn remove-btn"
          onClick={() => {
            removeCart(cart.id);
            deleteDocData({
              nameCollect: "carts",
              id: cart.id,
              metaDoc: "carts",
            });
          }}
          aria-label="Xóa mục tiêu"
        >
          <i className="bi bi-trash3-fill" />
        </button>
      </div>
    </article>
  );
}

export default function GoalCartBootstrapGreen() {
  const navigate = useNavigate();
  const { setSelectNavbar } = useSelectNavbarStore();
  const { carts, setCarts } = useCartStore();
  const { addPlan, editPlan, plans } = usePlanStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { cartEdit, setCartEdit } = useCartEditStore(); // thực tế nó chỉ là planId thôi
  const [title, setTitle] = useState(getCurrentMonth());
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [plan, setPlan] = useState<PlanModel>();

  useEffect(() => {
    if (carts.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [carts]);

  useEffect(() => {
    if (cartEdit) {
      getDocData({ id: cartEdit, nameCollect: "plans", setData: setPlan });
    }
  }, [cartEdit]);

  useEffect(() => {
    if (plan) {
      setTitle(plan.title);
    }
  }, [plan]);

  const groupedCarts = useMemo(() => {
    return groupArrayWithField(carts, "fieldId");
  }, [carts]);

  const handleSaveCart = () => {
    setIsLoading(true);
    const promiseItems = carts.map((cart) =>
      updateDocData({
        nameCollect: "carts",
        id: cart.id,
        valueUpdate: cart,
        metaDoc: "carts",
      }),
    );

    Promise.all(promiseItems)
      .then(() => {
        handleToastSuccess("Lưu nháp giỏ hàng thành công !");
      })
      .catch((error) => {
        handleToastError("Lưu nháp giỏ hàng thất bại !");
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleAddEditPlan = async () => {
    if (!user || !child) return;

    setIsLoading(true);

    try {
      if (!cartEdit) {
        const res: any = await httpsCallable(
          functions,
          "createPlanFromCarts",
        )({
          title,
          childId: child.id,
          carts,
        });

        addPlan({
          id: res.data.planId,
          type: "KH",
          title,
          childId: child.id,
          teacherIds: child.teacherIds,
          authorId: user.id,
          status: "pending",
          comment: "",
          updateById: user.id,
          createAt: Date.now(),
          updateAt: Date.now(),
        });

        handleToastSuccess("Thêm mới kế hoạch thành công !");
      } else {
        await httpsCallable(
          functions,
          "updatePlanFromCarts",
        )({
          planId: cartEdit,
          childId: child.id,
          carts,
          title
        });

        const index = plans.findIndex((item) => item.id === cartEdit);

        if (index !== -1) {
          editPlan(cartEdit, {
            ...plans[index],
            title,
            updateById: user.id,
            updateAt: Date.now(),
          });
        }

        handleToastSuccess("Chỉnh sửa kế hoạch thành công !");
      }

      setCarts([]);
      setTitle("");
      setCartEdit(null);

      navigate("../pending");
      setSelectNavbar("pending");
    } catch (error) {
      console.log(error);
      handleToastError(
        cartEdit
          ? "Chỉnh sửa kế hoạch thất bại !"
          : "Thêm mới kế hoạch thất bại !",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <h2 className="page-title fw-black text-green-dark mb-2">
              Giỏ mục tiêu
            </h2>
            <p className="fs-6 text-green-muted mb-0">
              Kiểm tra, chỉnh sửa và tạo kế hoạch can thiệp tháng cho trẻ
            </p>
          </div>
          <div className="col-12 col-lg-auto d-flex gap-2 flex-wrap">
            <Link
              to={`../bank`}
              onClick={() => setSelectNavbar("bank")}
              className="btn action-btn-soft"
            >
              <i className="bi bi-bank2 me-2 icon-yellow" />
              Thêm mục tiêu từ ngân hàng
            </Link>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-xl-9">
            {carts.length > 0 && (
              <div className="table-responsive cart-table-wrap">
                <table className="table cart-table align-middle mb-0">
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th className="area-cell">Lĩnh vực</th>
                      <th className="goal-cell">Mục tiêu</th>
                      <th className="content-cell">Nội dung</th>
                      <th className="support-cell">Mức độ hỗ trợ</th>
                      <th className="action-cell">Hành động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {carts.length > 0 &&
                      groupedCarts.map((_) => (
                        <GoalCartItem key={_.id} cart={_} />
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {carts.length > 0 && (
              <div className="row g-3 g-xl-4 cart-mobile-wrap">
                {carts.length > 0 &&
                  groupedCarts.map((cart) => (
                    <div className="col-12 col-lg-12" key={cart.id}>
                      <GoalCartCard cart={cart} />
                    </div>
                  ))}
              </div>
            )}

            {carts.length === 0 && (
              <div className="empty-cart">
                <i className="bi bi-cart3 fs-1 d-block mb-3 icon-yellow" />
                Không có mục tiêu phù hợp trong giỏ.
              </div>
            )}
          </div>

          <div className="col-12 col-xl-3">
            <aside className="create-plan-panel">
              <h3 className="h5 fw-black text-green-dark mb-3">
                {cartEdit ? "Chỉnh sửa" : "Tạo"} kế hoạch tháng
              </h3>

              <div className="mb-3">
                <div className="plan-field-label">Tháng kế hoạch</div>
                {/* <select className="form-select filter-select">
                  <option
                    defaultValue={`${cartEdit ? plan?.title : getCurrentMonth()}`}
                  >
                    {cartEdit ? plan?.title : getCurrentMonth()}
                  </option>
                </select> */}
                <select
                  className="form-select filter-select"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  // disabled={cartEdit}
                >
                  {/* {cartEdit ? (
                    <option value={plan?.title}>{plan?.title}</option>
                  ) : (
                    <>
                      <option value={getPreviousMonth()}>
                        {getPreviousMonth()}
                      </option>
                      <option value={getCurrentMonth()}>
                        {getCurrentMonth()}
                      </option>
                      <option value={getNextMonth()}>{getNextMonth()}</option>
                    </>
                  )} */}
                  <option value={getPreviousMonth()}>
                    {getPreviousMonth()}
                  </option>
                  <option value={getCurrentMonth()}>{getCurrentMonth()}</option>
                  <option value={getNextMonth()}>{getNextMonth()}</option>
                </select>
              </div>

              <div className="mb-3">
                <div className="plan-preview-item">
                  <span>Tổng mục tiêu</span>
                  <span>{carts.length}</span>
                </div>
              </div>

              {!cartEdit && (
                <button
                  className="btn action-btn-soft w-100"
                  onClick={disable ? undefined : handleSaveCart}
                  disabled={disable}
                >
                  <i className="bi bi-save2-fill me-2 icon-yellow" />
                  Lưu nháp
                </button>
              )}
              <SpaceComponent height={10} />
              <button
                onClick={disable ? undefined : handleAddEditPlan}
                className="btn action-btn-primary w-100 mb-2"
                disabled={disable}
              >
                {cartEdit ? (
                  <>
                    <i className="bi bi-floppy-fill me-2" />
                    Lưu kế hoạch
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-check-fill me-2" />
                    Gửi chờ duyệt
                  </>
                )}
              </button>
            </aside>
          </div>
        </div>
      </section>

      <LoadingOverlay show={isLoading} />
    </>
  );
}
// PHẦN CŨ CHƯA MATCHING VỚI SUGGEST

// import { httpsCallable } from "firebase/functions";
// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { SpaceComponent } from "../../components";
// import LoadingOverlay from "../../components/LoadingOverLay";
// import { convertTargetField } from "../../constants/convertTargetAndField";
// import { deleteDocData } from "../../constants/firebase/deleteDocData";
// import { getDocData } from "../../constants/firebase/getDocData";
// import { updateDocData } from "../../constants/firebase/updateDocData";
// import { groupArrayWithField } from "../../constants/groupArrayWithField";
// import {
//   handleToastError,
//   handleToastSuccess,
// } from "../../constants/handleToast";
// import {
//   getCurrentMonth,
//   getNextMonth,
//   getPreviousMonth,
// } from "../../constants/info";
// import { functions } from "../../firebase.config";
// import { PlanModel } from "../../models";
// import {
//   useCartEditStore,
//   useCartStore,
//   useChildStore,
//   useFieldStore,
//   useInterventionStore,
//   usePlanStore,
//   useSelectNavbarStore,
//   useSuggestStore,
//   useTargetStore,
//   useUserStore,
// } from "../../zustand";
// // import "./cart.css";
// import { Trash } from "iconsax-react";
// import { colors } from "../../constants/colors";
// import { sizes } from "../../constants/sizes";
// import { SuggestModel } from "../../models/SuggestModel";

// interface Props {
//   cart: any;
// }

// function CartItemComponent(props: Props) {
//   const { cart } = props;
//   const { fields } = useFieldStore();
//   const { removeCart, editCart } = useCartStore();
//   const [type, setType] = useState("");
//   const [text, setText] = useState("");
//   const [suggest, setSuggest] = useState<SuggestModel>();
//   const { interventions } = useInterventionStore();
//   const { targets } = useTargetStore();
//   const { suggests } = useSuggestStore();

//   useEffect(() => {
//     if (cart && cart.content) {
//       setText(cart.content);
//       const index = suggests.findIndex(
//         (suggest) => suggest.name === cart.content,
//       );
//       if (index !== -1) {
//         setSuggest(suggests[index]);
//         setType("Gợi ý");
//       } else {
//         setType("Ý khác");
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [cart]);
//   useEffect(() => {
//     if (type === "Ý khác" && text) {
//       editCart(cart.id, { ...cart, content: text });
//     }
//     if (type === "Gợi ý" && suggest) {
//       editCart(cart.id, { ...cart, content: suggest.name });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [text, suggest]);

//   const handleSelectIntervention = (val: string) => {
//     editCart(cart.id, { ...cart, intervention: val });
//   };
//   const handleSuggestsWithField = (fieldId: string) => {
//     const items = suggests.filter((suggest) => suggest.fieldId === fieldId);
//     return items;
//   };

//   return (
//     <tr>
//       <th>{convertTargetField(cart.targetId, targets, fields).nameField}</th>
//       <td>{convertTargetField(cart.targetId, targets, fields).nameTarget}</td>
//       <td>{convertTargetField(cart.targetId, targets, fields).levelTarget}</td>
//       <td style={{ width: "20%" }}>
//         <select
//           value={cart.intervention}
//           className={`form-select`}
//           aria-label="Default select example"
//           onChange={(val) => handleSelectIntervention(val.target.value)}
//         >
//           <option defaultValue={""}>Chọn</option>
//           {interventions.length > 0 &&
//             interventions.map((_, index) => (
//               <option key={index} value={_.name}>
//                 {_.name}
//               </option>
//             ))}
//         </select>
//       </td>
//       <td style={{ width: "30%" }}>
//         <div className="d-flex">
//           <button
//             type="button"
//             className="btn btn-success"
//             // data-bs-dismiss="modal"
//             onClick={() => setType("Gợi ý")}
//           >
//             Gợi ý
//           </button>
//           <SpaceComponent width={10} />
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={() => setType("Ý khác")}
//           >
//             Ý khác
//           </button>
//         </div>
//         <div>
//           <SpaceComponent height={8} />
//           {type === "Gợi ý" && (
//             // <Select<SuggestModel>
//             //   getOptionLabel={(option) => option.name}
//             //   getOptionValue={(option) => option.id.toString()}
//             //   options={handleSuggestsWithField(cart.fieldId)}
//             //   maxMenuHeight={sizes.height}
//             //   onChange={(val: SingleValue<SuggestModel>) => setSuggest(val as SuggestModel)}
//             //   value={suggest}
//             // />
//             <Select<SuggestModel>
//               getOptionLabel={(option) => option.name}
//               getOptionValue={(option) => option.id}
//               options={handleSuggestsWithField(cart.fieldId)}
//               value={suggest}
//               onChange={(val) => setSuggest(val as SuggestModel)}
//               menuPortalTarget={document.body}
//               menuPosition="fixed"
//               styles={{
//                 menuPortal: (base) => ({
//                   ...base,
//                   zIndex: 9999,
//                 }),
//               }}
//             />
//           )}

//           {type === "Ý khác" && (
//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               className="form-control"
//               placeholder="Nhập đánh giá"
//               rows={5}
//               cols={400}
//               id="floatingTextarea2"
//             ></textarea>
//           )}
//         </div>
//       </td>
//       <td>
//         <div
//           style={{ textAlign: "center", cursor: "pointer" }}
//           onClick={() => {
//             removeCart(cart.id);
//             deleteDocData({
//               nameCollect: "carts",
//               id: cart.id,
//               metaDoc: "carts",
//             });
//           }}
//         >
//           <Trash
//             size={sizes.smallTitle}
//             color={colors.red}
//             variant="Bold"
//             style={{ cursor: "pointer" }}
//           />
//         </div>
//       </td>
//     </tr>
//   );
// }

// export default function GoalCartBootstrapGreen() {
//   const navigate = useNavigate();
//   const { setSelectNavbar } = useSelectNavbarStore();
//   const { carts, setCarts } = useCartStore();
//   const { addPlan, editPlan, plans } = usePlanStore();
//   const { child } = useChildStore();
//   const { user } = useUserStore();
//   const { cartEdit, setCartEdit } = useCartEditStore(); // thực tế nó chỉ là planId thôi
//   const [title, setTitle] = useState(getCurrentMonth());
//   const [isLoading, setIsLoading] = useState(false);
//   const [plan, setPlan] = useState<PlanModel>();
//   const [disable, setDisable] = useState(false);

//   useEffect(() => {
//     if (carts.length > 0) {
//       setDisable(false);
//     } else {
//       setDisable(true);
//     }
//   }, [carts]);

//   useEffect(() => {
//     if (cartEdit) {
//       getDocData({ id: cartEdit, nameCollect: "plans", setData: setPlan });
//     }
//   }, [cartEdit]);

//   useEffect(() => {
//     if (plan) {
//       setTitle(plan.title);
//     }
//   }, [plan]);

//   const groupedCarts = useMemo(() => {
//     return groupArrayWithField(carts, "fieldId");
//   }, [carts]);

//   const handleSaveCart = () => {
//     setIsLoading(true);
//     const promiseItems = carts.map((cart) =>
//       updateDocData({
//         nameCollect: "carts",
//         id: cart.id,
//         valueUpdate: cart,
//         metaDoc: "carts",
//       }),
//     );

//     Promise.all(promiseItems)
//       .then(() => {
//         handleToastSuccess("Lưu nháp giỏ hàng thành công !");
//       })
//       .catch((error) => {
//         handleToastError("Lưu nháp giỏ hàng thất bại !");
//         console.log(error);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };
//   const handleAddEditPlan = async () => {
//     if (!user || !child) return;

//     setIsLoading(true);

//     try {
//       if (!cartEdit) {
//         const res: any = await httpsCallable(
//           functions,
//           "createPlanFromCarts",
//         )({
//           title,
//           childId: child.id,
//           carts,
//         });

//         addPlan({
//           id: res.data.planId,
//           type: "KH",
//           title,
//           childId: child.id,
//           teacherIds: child.teacherIds,
//           authorId: user.id,
//           status: "pending",
//           comment: "",
//           updateById: user.id,
//           createAt: Date.now(),
//           updateAt: Date.now(),
//         });

//         handleToastSuccess("Thêm mới kế hoạch thành công !");
//       } else {
//         await httpsCallable(
//           functions,
//           "updatePlanFromCarts",
//         )({
//           planId: cartEdit,
//           childId: child.id,
//           carts,
//         });

//         const index = plans.findIndex((item) => item.id === cartEdit);

//         if (index !== -1) {
//           editPlan(cartEdit, {
//             ...plans[index],
//             updateById: user.id,
//             updateAt: Date.now(),
//           });
//         }

//         handleToastSuccess("Chỉnh sửa kế hoạch thành công !");
//       }

//       setCarts([]);
//       setTitle("");
//       setCartEdit(null);

//       navigate("../pending");
//       setSelectNavbar("pending");
//     } catch (error) {
//       console.log(error);
//       handleToastError(
//         cartEdit
//           ? "Chỉnh sửa kế hoạch thất bại !"
//           : "Thêm mới kế hoạch thất bại !",
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{css}</style>
//       <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
//         <div className="row align-items-start g-3 mb-3">
//           <div className="col-12 col-lg">
//             <h2 className="page-title fw-black text-green-dark mb-2">
//               Giỏ mục tiêu
//             </h2>
//             <p className="fs-6 text-green-muted mb-0">
//               Kiểm tra, chỉnh sửa và tạo kế hoạch can thiệp tháng cho trẻ
//             </p>
//           </div>
//           <div className="col-12 col-lg-auto d-flex gap-2 flex-wrap">
//             <Link
//               to={`../bank`}
//               onClick={() => setSelectNavbar("bank")}
//               className="btn action-btn-soft"
//             >
//               <i className="bi bi-bank2 me-2 icon-yellow" />
//               Thêm mục tiêu từ ngân hàng
//             </Link>
//           </div>
//         </div>

//         <div className="row g-4">
//           <div className="col-12 col-xl-9">
//             {carts.length > 0 && (
//               <div className="table-responsive cart-table-wrap">
//                 <table
//                   className="table cart-table align-middle mb-0"
//                   style={{ minWidth: "0 !important" }}
//                 >
//                   <thead>
//                     <tr style={{ textAlign: "center" }}>
//                       <th scope="col">Lĩnh vực</th>
//                       <th scope="col">Mục tiêu</th>
//                       <th scope="col">Level</th>
//                       <th scope="col">Mức độ hỗ trợ</th>
//                       <th scope="col">Nội dung</th>
//                       <th scope="col">Handle</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {carts.length > 0 &&
//                       groupedCarts.map((_, index) => (
//                         <CartItemComponent key={index} cart={_} />
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* {carts.length > 0 && (
//               <div className="row g-3 g-xl-4 cart-mobile-wrap">
//                 {carts.length > 0 &&
//                   groupedCarts.map((cart) => (
//                     <div className="col-12 col-lg-12" key={cart.id}>
//                       <GoalCartCard cart={cart} />
//                     </div>
//                   ))}
//               </div>
//             )} */}

//             {carts.length === 0 && (
//               <div className="empty-cart">
//                 <i className="bi bi-cart3 fs-1 d-block mb-3 icon-yellow" />
//                 Không có mục tiêu phù hợp trong giỏ.
//               </div>
//             )}
//           </div>

//           <div className="col-12 col-xl-3">
//             <aside className="create-plan-panel">
//               <h3 className="h5 fw-black text-green-dark mb-3">
//                 {cartEdit ? "Chỉnh sửa" : "Tạo"} kế hoạch tháng
//               </h3>

//               <div className="mb-3">
//                 <div className="plan-field-label">Tháng kế hoạch</div>
//                 {/* <select className="form-select filter-select">
//                   <option
//                     defaultValue={`${cartEdit ? plan?.title : getCurrentMonth()}`}
//                   >
//                     {cartEdit ? plan?.title : getCurrentMonth()}
//                   </option>
//                 </select> */}
//                 <select
//                   className="form-select filter-select"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   disabled={cartEdit}
//                 >
//                   {cartEdit ? (
//                     <option value={plan?.title}>{plan?.title}</option>
//                   ) : (
//                     <>
//                       <option value={getPreviousMonth()}>
//                         {getPreviousMonth()}
//                       </option>
//                       <option value={getCurrentMonth()}>
//                         {getCurrentMonth()}
//                       </option>
//                       <option value={getNextMonth()}>{getNextMonth()}</option>
//                     </>
//                   )}
//                 </select>
//               </div>

//               <div className="mb-3">
//                 <div className="plan-preview-item">
//                   <span>Tổng mục tiêu</span>
//                   <span>{carts.length}</span>
//                 </div>
//               </div>

//               {!cartEdit && (
//                 <button
//                   className="btn action-btn-soft w-100"
//                   onClick={disable ? undefined : handleSaveCart}
//                   disabled={disable}
//                 >
//                   <i className="bi bi-save2-fill me-2 icon-yellow" />
//                   Lưu nháp
//                 </button>
//               )}
//               <SpaceComponent height={10} />
//               <button
//                 onClick={disable ? undefined : handleAddEditPlan}
//                 className="btn action-btn-primary w-100 mb-2"
//                 disabled={disable}
//               >
//                 {cartEdit ? (
//                   <>
//                     <i className="bi bi-floppy-fill me-2" />
//                     Lưu kế hoạch
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-send-check-fill me-2" />
//                     Gửi chờ duyệt
//                   </>
//                 )}
//               </button>
//             </aside>
//           </div>
//         </div>
//       </section>

//       <LoadingOverlay show={isLoading} />
//     </>
//   );
// }
// const css = `
// .cart-table-wrap {
//   overflow-x: auto;
//   overflow-y: visible;
//   -webkit-overflow-scrolling: touch;
// }

// .cart-table {
//   min-width: 1200px;
//   width: 100%;
// }

// .cart-table-wrap {
//   overflow-x: auto;
//   overflow-y: visible;
//   -webkit-overflow-scrolling: touch;

//   border-radius: 20px;
//   border: 1px solid rgba(6, 95, 70, 0.12);
//   background: #fff;
//   box-shadow: 0 12px 30px rgba(6, 95, 70, 0.08);
// }

// /* Để border-radius hoạt động với table */
// .cart-table {
//   min-width: 1300px;
//   margin-bottom: 0;
//   border-collapse: separate;
//   border-spacing: 0;
//   background: #fff;
// }

// /* Header */
// .cart-table thead th {
//   background: linear-gradient(
//     135deg,
//     var(--green-700),
//     var(--green-600)
//   ) !important;

//   color: #fff;
//   font-weight: 800;
//   font-size: 0.9rem;
//   text-align: center;
//   vertical-align: middle;
//   padding: 16px 12px;
//   border: none;
//   white-space: nowrap;
// }

// /* Bo góc header */
// .cart-table thead th:first-child {
//   border-top-left-radius: 20px;
// }

// .cart-table thead th:last-child {
//   border-top-right-radius: 20px;
// }

// /* Body */
// .cart-table tbody td,
// .cart-table tbody th {
//   padding: 16px 12px;
//   vertical-align: top;
//   border-top: 1px solid rgba(6, 95, 70, 0.08);
// }

// /* Hover */
// .cart-table tbody tr {
//   transition: all 0.2s ease;
// }

// .cart-table tbody tr:hover {
//   background: #f0fdf4;
// }

// /* Zebra */
// .cart-table tbody tr:nth-child(even) {
//   background: rgba(240, 253, 244, 0.45);
// }

// /* Cột lĩnh vực */
// .cart-table tbody th {
//   color: var(--green-900);
//   font-weight: 800;
// }

// /* Scrollbar đẹp */
// .cart-table-wrap::-webkit-scrollbar {
//   height: 10px;
// }

// .cart-table-wrap::-webkit-scrollbar-track {
//   background: #ecfdf5;
//   border-radius: 999px;
// }

// .cart-table-wrap::-webkit-scrollbar-thumb {
//   background: var(--green-600);
//   border-radius: 999px;
// }

// .cart-table-wrap::-webkit-scrollbar-thumb:hover {
//   background: var(--green-700);
// }

// @media (max-width: 768px) {
//   .cart-table {
//     min-width: 1000px;
//   }
// }
// `;
{
  /* <div className="row g-4">
          <div className="col-12 col-xl-9">
            {carts.length > 0 ? (
              <div className="row g-3 g-xl-4">
                {carts.length > 0 &&
                  groupArrayWithField(carts, "fieldId").map((cart) => (
                    <div className="col-12 col-lg-12" key={cart.id}>
                      <GoalCartCard cart={cart} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="empty-cart">
                <i className="bi bi-cart3 fs-1 d-block mb-3 icon-yellow" />
                Không có mục tiêu phù hợp trong giỏ.
              </div>
            )}
          </div> */
}

// function GoalCartCard({ cart }: any) {
//   const { fields } = useFieldStore();
//   const { interventions } = useInterventionStore();
//   const { targets } = useTargetStore();
//   // const { suggests } = useSuggestStore();
//   const { removeCart, editCart } = useCartStore();
//   const [type, setType] = useState("");
//   const [text, setText] = useState("");
//   const [suggest, setSuggest] = useState<SuggestModel>();

//   useEffect(() => {
//     if (cart && cart.content) {
//       setText(cart.content);
//       const index = suggests.findIndex(
//         (suggest) => suggest.name === cart.content,
//       );
//       if (index !== -1) {
//         setSuggest(suggests[index]);
//         setType("Gợi ý");
//       } else {
//         setType("Ý khác");
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [cart]);

//   useEffect(() => {
//     if (type === "Ý khác" && text) {
//       editCart(cart.id, { ...cart, content: text });
//     }
//     if (type === "Gợi ý" && suggest) {
//       editCart(cart.id, { ...cart, content: suggest.name });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [text, suggest]);

//   const handleSelectIntervention = (val: string) => {
//     editCart(cart.id, { ...cart, intervention: val });
//   };
//   const handleSuggestsWithField = (fieldId: string) => {
//     const items = suggests.filter((suggest) => suggest.fieldId === fieldId);
//     return items;
//   };

//   return (
//     <article className="goal-cart-card">
//       <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
//         <div className="min-w-0">
//           <div className="d-flex flex-wrap gap-2 mb-2">
//             <span className="goal-area">
//               <i className="bi bi-flower2 me-1" />
//               {convertTargetField(cart.targetId, targets, fields).nameField}
//             </span>
//             <span className="goal-level">Level: {cart.level}</span>

//           </div>
//           <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
//             <span className="goal-area">
//               <i className="bi bi-flower2 me-1" />
//               {convertTargetField(cart.targetId, targets, fields).nameField}
//             </span>

//             <span className="goal-level">
//               Level: {cart.level}
//             </span>

//             <select
//               className="form-select form-select-sm intervention-select"
//               value={cart.intervention}
//               onChange={(e) => handleSelectIntervention(e.target.value)}
//             >
//               <option value="">Mức độ hỗ trợ</option>
//               {interventions.map((item) => (
//                 <option value={item.name} key={item.id}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <h3 className="goal-title">{cart.name}</h3>
//           <div className="goal-description-card">
//             <div className="goal-description-label">
//               <i className="bi bi-card-text me-2" />
//               Mô tả
//             </div>

//             <div className="goal-description-content">
//               {cart.content || "Chưa có mô tả cho mục tiêu này. Liên hệ Admin"}
//             </div>
//           </div>

//           <div className="row g-2 mt-2">
//             <div className="col-12 col-md-12">
//               <select
//                 className="form-select"
//                 value={cart.intervention}
//                 onChange={(val) => handleSelectIntervention(val.target.value)}
//               >
//                 <option value="">Chọn mức độ hỗ trợ</option>
//                 {interventions.map((_) => (
//                   <option value={_.name} key={_.id}>
//                     {_.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//         <button
//           className="btn remove-btn"
//           onClick={() => {
//             removeCart(cart.id);
//             deleteDocData({
//               nameCollect: "carts",
//               id: cart.id,
//               metaDoc: "carts",
//             });
//           }}
//           aria-label="Xóa mục tiêu"
//         >
//           <i className="bi bi-trash3-fill" />
//         </button>
//       </div>

//       <div className="d-flex flex-wrap align-items-center mb-2">
//         <button
//           type="button"
//           className="btn btn-success"
//           onClick={() => setType("Gợi ý")}
//         >
//           Gợi ý
//         </button>
//         <SpaceComponent width={10} />
//         <button
//           type="button"
//           className="btn btn-primary"
//           onClick={() => setType("Ý khác")}
//         >
//           Ý khác
//         </button>
//       </div>

//       <div>
//         <SpaceComponent height={8} />
//         {type === "Gợi ý" && (
//           <Select<SuggestModel>
//             getOptionLabel={(option) => option.name}
//             getOptionValue={(option) => option.id.toString()}
//             options={handleSuggestsWithField(cart.fieldId)}
//             maxMenuHeight={sizes.height}
//             onChange={(val: SingleValue<SuggestModel>) =>
//               setSuggest(val as SuggestModel)
//             }
//             value={suggest}
//           />
//         )}

//         {type === "Ý khác" && (
//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             className="form-control"
//             placeholder="Nhập đánh giá"
//             rows={5}
//             cols={400}
//             id="floatingTextarea2"
//           ></textarea>
//         )}
//       </div>
//     </article>
//   );
// }
