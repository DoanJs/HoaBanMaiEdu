import { Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { RowComponent, SpaceComponent } from ".";
import { colors } from "../constants/colors";
import useCartStore from "../zustand/useCartStore";
import useFieldStore from "../zustand/useFieldStore";
import useInterventionStore from "../zustand/useInterventionStore";

interface Props {
  index: number
  cart: any
}

export default function CartItemComponent(props: Props) {
  const { index, cart } = props
  const { fields } = useFieldStore()
  const { removeCart, editCart } = useCartStore()
  const [type, setType] = useState("");
  const [content, setContent] = useState('');
  const { interventions } = useInterventionStore()

  useEffect(() => {
    if (cart) {
      setContent(cart.content)
    }
  }, [cart])

  useEffect(() => {
    if (type === 'Ý khác' && content) {
      editCart(cart.id, { ...cart, content: content })
    }
  }, [type, content])


  const showField = () => {
    let title: string
    const index = fields.findIndex((field) => field.id === cart.fieldId)
    if (index !== -1) {
      title = fields[index].name
    } else {
      title = ''
    }
    return title
  }
  const handleSelectIntervention = (val: string) => {
    editCart(cart.id, { ...cart, intervention: val })
  }


  return (
    <tr>
      <td scope="row">{index + 1}</td>
      <td>{showField()}</td>
      <td>{cart.name}</td>
      <td style={{ width: '15%' }}>
        <select className="form-select" aria-label="Default select example" onChange={(val) => handleSelectIntervention(val.target.value)}>
          <option defaultValue={''}>Chọn</option>
          {
            interventions.length > 0 && 
            interventions.map((_, index) => <option key={index} value={_.name}>{_.name}</option>)
          }
        </select>
      </td>
      <td style={{ width: "45%" }}>
        <RowComponent>
          <button
            type="button"
            className="btn btn-success"
            data-bs-dismiss="modal"
            onClick={() => setType("Gợi ý")}
          >
            Gợi ý
          </button>
          <SpaceComponent width={10} />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setType("Ý khác")}
          >
            Ý khác
          </button>
        </RowComponent>
        <SpaceComponent height={10} />
        <div>
          {type === "Gợi ý" &&
            Array.from({ length: 5 }).map((_, index) => (
              <RowComponent
                styles={{
                  cursor: "pointer",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "flex-start",
                }}
                key={index}
              >
                <div
                  className="form-check"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 6,
                  }}
                >
                  <input
                    onChange={() => { }}
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={`flexCheckChecked${index}`}
                  />
                </div>
                <label htmlFor={`flexCheckChecked${index}`}>
                  Cô đưa ra yêu cầu/ hướng dẫn/hỗ trợ. Sau đó cô giảm hỗ trợ đến
                  khi con thực hiện được. Cô đưa ra yêu cầu/ hướng dẫn/hỗ trợ.
                  Sau đó cô giảm hỗ trợ đến khi con thực hiện được.
                </label>
              </RowComponent>
            ))}

          {type === "Ý khác" && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              placeholder="Nhập đánh giá"
              rows={6}
              cols={400}
              id="floatingTextarea2"
            ></textarea>
          )}
        </div>
      </td>
      <td>
        <div
          style={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => removeCart(cart.id)}
        >
          <Trash size={20} color={colors.red} variant="Bold" style={{ cursor: 'pointer' }} />
        </div>
      </td>
    </tr>
  );
}
