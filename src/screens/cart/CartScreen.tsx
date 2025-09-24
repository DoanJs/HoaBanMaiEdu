import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { AddCircle, CardRemove1 } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CartItemComponent,
  ModalAddPlanComponent,
  ModalDeleteComponent,
  RowComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import { colors } from "../../constants/colors";
import { addDocData } from "../../constants/firebase/addDocData";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { getDocData } from "../../constants/firebase/getDocData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { db } from "../../firebase.config";
import { PlanModel } from "../../models";
import {
  useCartEditStore,
  useCartStore,
  useChildStore,
  usePlanStore,
  useSelectTargetStore,
  useUserStore,
} from "../../zustand";

export default function CartScreen() {
  const navigate = useNavigate();
  const { setSelectTarget } = useSelectTargetStore();
  const { carts, setCarts } = useCartStore();
  const { addPlan } = usePlanStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { cartEdit, setCartEdit } = useCartEditStore();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [plan, setPlan] = useState<PlanModel>();
  const { editPlan, plans } = usePlanStore();

  useEffect(() => {
    if (carts.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [carts, title]);

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

  const handleAddEditPlan = async () => {
    if (user && child) {
      setIsLoading(true);
      if (!cartEdit) {
        await addDocData({
          nameCollect: "plans",
          value: {
            type: "KH",
            title,
            childId: child.id,
            teacherIds: child.teacherIds,
            authorId: user.id,
            status: "pending",
            comment: "",

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          },
          metaDoc: "plans",
        })
          .then(async (result) => {
            addPlan({
              id: result.id,
              type: "KH",
              title,
              childId: child.id,
              teacherIds: child.teacherIds,
              authorId: user.id,
              status: "pending",
              comment: "",

              createAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            });
            const promiseItems = carts.map((cart) =>
              addDocData({
                nameCollect: "planTasks",
                value: {
                  content: cart.content ?? "",
                  intervention: cart.intervention ?? "",
                  teacherIds: child.teacherIds,
                  authorId: user.id,
                  planId: result.id,
                  targetId: cart.targetId,
                  childId: child.id,

                  createAt: serverTimestamp(),
                  updateAt: serverTimestamp(),
                },
                metaDoc: "plans",
              })
            );

            await Promise.all(promiseItems);
            handleToastSuccess("Thêm mới kế hoạch thành công !");
            setIsLoading(false);
            setCarts([]);
            setTitle("");
            const promiseCartItems = carts.map((cart) =>
              deleteDocData({
                nameCollect: "carts",
                id: cart.id,
                metaDoc: "carts",
              })
            );
            await Promise.all(promiseCartItems);
          })
          .catch((error) => {
            handleToastError("Thêm mới kế hoạch thất bại !");
            setIsLoading(false);
            console.log(error);
          });
      } else {
        updateDocData({
          nameCollect: "plans",
          id: cartEdit,
          valueUpdate: {
            title,
          },
          metaDoc: "plans",
        })
          .then(() => {
            const index = plans.findIndex((_) => _.id === cartEdit);
            if (index !== -1) {
              editPlan(cartEdit, { ...plans[index], title });
            }
          })
          .catch((error) => {
            console.log(error);
          });

        // xoa het cai cu
        const snapShot = await getDocs(
          query(
            collection(db, "planTasks"),
            where("teacherIds", "array-contains", user.id),
            where("planId", "==", cartEdit)
          )
        );
        if (!snapShot.empty) {
          const promisePlanTasksOld = snapShot.docs.map((_) =>
            deleteDocData({
              nameCollect: "planTasks",
              id: _.id,
              metaDoc: "plans",
            })
          );
          await Promise.all(promisePlanTasksOld);
        }

        // tao lai cai moi
        const promisePlanTasksNew = carts.map((cart) =>
          addDocData({
            nameCollect: "planTasks",
            value: {
              childId: child.id,
              planId: cartEdit,
              targetId: cart.targetId,
              teacherIds: child.teacherIds,
              authorId: user.id,
              content: cart.content ?? "",
              intervention: cart.intervention ?? "",

              createAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            },
            metaDoc: "plans",
          })
        );

        await Promise.all(promisePlanTasksNew);
        handleToastSuccess("Chỉnh sửa kế hoạch thành công !");
        setIsLoading(false);
        setCartEdit(null);
        setCarts([]);
        setTitle("");
      }
      navigate("../pending");
      setSelectTarget("CHỜ DUYỆT");
    }
  };
  const handleSaveCart = () => {
    setIsLoading(true)
    const promiseItems = carts.map((cart) => updateDocData({
      nameCollect: 'carts',
      id: cart.id,
      valueUpdate: cart,
      metaDoc: 'carts'
    }))

    Promise.all(promiseItems).then(() => {
      setIsLoading(false)
      handleToastSuccess('Lưu nháp giỏ hàng thành công !')
    }).catch(error => {
      setIsLoading(false)
      handleToastError('Lưu nháp giỏ hàng thất bại !')
      console.log(error)
    })
  }
  return (
    <div style={{ width: "100%" }}>
      <SpaceComponent height={10} />
      <RowComponent justify="space-between">
        <div
          className={`input-group ${widthSmall && "input-group-sm"}`}
          style={{ width: "50%" }}
        >
          <span className="input-group-text" id="basic-addon1">
            Tạo kế hoạch tháng
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="form-control"
            placeholder="VD: KH 09/2025"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>

        {
          carts.length > 0 &&
          <div
            style={{ cursor: 'pointer', display: 'flex' }}
            data-bs-dismiss="modal"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal">
            <CardRemove1
              size={widthSmall ? sizes.smallTitle : sizes.bigTitle}
              color={colors.red}
              variant="Bold" />
            <SpaceComponent width={4} />
            <TextComponent text="Reset giỏ mục tiêu"
              size={widthSmall ? sizes.text : sizes.thinTitle} />
          </div>
        }
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
          <AddCircle
            size={widthSmall ? sizes.smallTitle : sizes.bigTitle}
            color={colors.primary}
            variant="Bold"
          />
          <SpaceComponent width={4} />
          <TextComponent
            text="Thêm mục tiêu"
            size={widthSmall ? sizes.text : sizes.thinTitle}
          />
        </Link>
      </RowComponent>
      <SpaceComponent height={10} />
      <div style={{ height: widthSmall ? "78%" : "85%", overflowY: "scroll" }}>
        <table
          className="table table-bordered"
          style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}
        >
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Mục tiêu</th>
              <th scope="col">Level</th>
              <th scope="col">Mức độ hỗ trợ</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {carts.length > 0 &&
              groupArrayWithField(carts, "fieldId").map((_, index) => (
                <CartItemComponent key={index} cart={_} />
              ))}
          </tbody>
        </table>
      </div>

      <RowComponent
        justify="flex-end"
        styles={{
          padding: 10,
        }}
      >
        {carts.length > 0 &&
          (title === "" ? (
            <>
              <button
                style={{
                  fontSize: widthSmall ? sizes.text : sizes.bigText,
                }}
                onClick={disable ? undefined : handleSaveCart}
                type="button"
                className="btn btn-warning"
              >
                {isLoading ? (
                  <SpinnerComponent />
                ) : (
                  <TextComponent text="Lưu nháp" color={colors.bacground} />
                )}
              </button>
              <SpaceComponent width={20} />
              <button
                style={{
                  fontSize: widthSmall ? sizes.text : sizes.bigText,
                }}
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#addPlanModal"
              >
                {isLoading ? (
                  <SpinnerComponent />
                ) : cartEdit ? (
                  <>Lưu</>
                ) : (
                  <TextComponent text="Gửi duyệt" color={colors.bacground} />
                )}
              </button>
            </>
          ) : (
            <button
              style={{
                fontSize: widthSmall ? sizes.text : sizes.bigText,
              }}
              onClick={disable ? undefined : handleAddEditPlan}
              type="button"
              className="btn btn-primary"
            >
              {isLoading ? (
                <SpinnerComponent />
              ) : cartEdit ? (
                <>Lưu</>
              ) : (
                <TextComponent text="Gửi duyệt" color={colors.bacground} />
              )}
            </button>
          ))}
      </RowComponent>

      <LoadingOverlay show={isLoading} />
      <ModalAddPlanComponent
        title={title}
        setTitle={setTitle}
        handleAddEditPlan={handleAddEditPlan}
      />
      <ModalDeleteComponent
        data={{
          id: '',
          itemTasks: carts,
          nameCollect: 'carts',
          setForm: setCarts
        }}
      />
    </div>
  );
}
