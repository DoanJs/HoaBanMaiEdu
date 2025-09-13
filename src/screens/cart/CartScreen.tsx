import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemComponent, RowComponent, SpaceComponent, SpinnerComponent } from "../../components";
import { colors } from "../../constants/colors";
import { query_interventions } from "../../constants/firebase/query/Index";
import { useFirestoreWithMeta } from "../../constants/useFirestoreWithMeta";
import { InterventionModel } from "../../models/InterventionModel";
import useCartStore from "../../zustand/useCartStore";
import useChildStore from "../../zustand/useChildStore";
import useInterventionStore from "../../zustand/useInterventionStore";
import useSelectTargetStore from "../../zustand/useSelectTargetStore";
import useUserStore from "../../zustand/useUserStore";
import { addDocData } from "../../constants/firebase/addDocData";
import { serverTimestamp } from "firebase/firestore";
import usePlanStore from "../../zustand/usePlanStore";

export default function CartScreen() {
  const navigate = useNavigate()
  const { setSelectTarget } = useSelectTargetStore()
  const { carts, setCarts } = useCartStore()
  const { child } = useChildStore()
  const { user } = useUserStore()
  const [title, setTitle] = useState('');
  const {addPlan} = usePlanStore()
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const { setInterventions } = useInterventionStore()

  const { data: data_interventions, loading } = useFirestoreWithMeta({
    key: 'interventions',
    query: query_interventions,
    metaDoc: 'interventions'
  })

  useEffect(() => {
    if (carts.length > 0 && title!=='') {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [carts, title])

  useEffect(() => {
    if (!loading) {
      setInterventions(data_interventions as InterventionModel[])
    }
  }, [data_interventions, loading])


  const handleAddPlan = () => {
    if (!title) return alert('Thêm tháng kế hoạch')
    if (title && user && child) {
      setIsLoading(true)
      addDocData({
        nameCollect: 'plans', 
        value: {
          title,
          childId: child.id,
          teacherId: user.id,
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc:'plans'
      }).then(async result => {
        setIsLoading(false)
        addPlan({
          id: result.id,
          title,
          childId: child.id,
          teacherId: user.id,
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        })
        const promiseItems = carts.map((cart) => addDocData({
          nameCollect: 'planTasks',
          value: {
            planId: result.id,
            targetId: cart.id,
            content: cart.content,
            intervention: cart.intervention,

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          },
          metaDoc: 'plans'
        }))

        await Promise.all(promiseItems)
        setCarts([])
        setTitle('')
      }).catch(error => console.log(error))
    }

    navigate(`/home/${user?.id}/plan`)
    setSelectTarget('KẾ HOẠCH')
  }

  if (loading) return <SpinnerComponent />
  return (
    <div style={{ width: "100%" }}>
      <SpaceComponent height={10} />
      <div className="input-group" style={{ width: "40%" }}>
        <span className="input-group-text" id="basic-addon1">
          Tạo kế hoạch tháng
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="form-control"
          placeholder='VD: KH 09/2022'
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </div>
      <div style={{ height: "85%", overflowY: "scroll" }}>
        <table className="table">
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
            {carts.length > 0 && carts.map((_, index) => (
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
            borderColor: disable ? colors.gray : undefined
          }}
          onClick={disable ? undefined : handleAddPlan}
          type="button" className="btn btn-primary">
          {isLoading ? <SpinnerComponent /> : <>Tạo mới</>}
        </button>
      </RowComponent>
    </div>
  );
}
