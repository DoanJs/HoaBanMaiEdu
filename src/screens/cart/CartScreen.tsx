import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { AddCircle } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CartItemComponent,
  RowComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { addDocData } from "../../constants/firebase/addDocData";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { getDocData } from "../../constants/firebase/getDocData";
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

  useEffect(() => {
    if (carts.length > 0 && title !== "") {
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
            teacherId: user.id,
            status: "pending",
            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          },
          metaDoc: "plans",
        })
          .then(async (result) => {
            setIsLoading(false);
            addPlan({
              id: result.id,
              type: "KH",
              title,
              childId: child.id,
              teacherId: user.id,
              status: "pending",
              createAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            });
            const promiseItems = carts.map((cart) =>
              addDocData({
                nameCollect: "planTasks",
                value: {
                  childId: child.id,
                  planId: result.id,
                  targetId: cart.id,
                  content: cart.content,
                  intervention: cart.intervention,

                  createAt: serverTimestamp(),
                  updateAt: serverTimestamp(),
                },
                metaDoc: "plans",
              })
            );

            await Promise.all(promiseItems);
            setCarts([]);
            setTitle("");
          })
          .catch((error) => {
            setIsLoading(false);
            console.log(error);
          });
      } else {
        // xoa het cai cu
        const snapShot = await getDocs(
          query(collection(db, "planTasks"), where("planId", "==", cartEdit))
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
              targetId: cart.id,
              content: cart.content,
              intervention: cart.intervention,

              createAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            },
            metaDoc: "plans",
          })
        );

        await Promise.all(promisePlanTasksNew);
        setCartEdit(null);
        setCarts([]);
        setTitle("");
      }
      navigate("../pending");
      setSelectTarget("CHỜ DUYỆT");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <SpaceComponent height={10} />
      <RowComponent justify="space-between">
        <div className="input-group" style={{ width: "30%" }}>
          <span className="input-group-text" id="basic-addon1">
            Tạo kế hoạch tháng
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="form-control"
            placeholder="VD: KH 09/2022"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
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
          <TextComponent text="Thêm mục tiêu" size={sizes.bigText} />
        </Link>
      </RowComponent>
      <div style={{ height: "85%", overflowY: "scroll" }}>
        <table className="table table-bordered">
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">STT</th>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Mục tiêu</th>
              <th scope="col">Mức độ hỗ trợ</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {carts.length > 0 &&
              carts.map((_, index) => (
                <CartItemComponent key={index} index={index} cart={_} />
              ))}
          </tbody>
        </table>
      </div>

      <RowComponent
        justify="flex-end"
        styles={{
          padding: 20,
        }}
      >
        <button
          style={{
            background: disable ? colors.gray : undefined,
            borderColor: disable ? colors.gray : undefined,
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
            <>Tạo mới</>
          )}
        </button>
      </RowComponent>
    </div>
  );
}
