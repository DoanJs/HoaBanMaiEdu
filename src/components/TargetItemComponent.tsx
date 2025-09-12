import { colors } from "../constants/colors";
import { TargetModel } from "../models/TargetModel";
import useCartStore from "../zustand/useCartStore";

interface Props {
  index: number;
  target: TargetModel
}

export default function TargetItemComponent(props: Props) {
  const { index, target } = props;
  const { carts, removeCart, addCart } = useCartStore()

  const showSelected = () => {
    let status: boolean = false
    const index = carts.findIndex((cart) => cart.id === target.id)
    if (index === -1) {
      status = false
    } else {
      status = true
    }

    return status
  }

  const handleSelected = () => {
    const index = carts.findIndex((cart) => cart.id === target.id)
    if (index !== -1) {
      removeCart(target.id)
    } else {
      addCart(target)
    }
  }
  return (
    <tr style={{ color: colors.textBold }}>
      <td style={{ textAlign: "center" }}>{index + 1}</td>
      <td>
        {target.name}
      </td>
      <td style={{ textAlign: "center" }}>{target.level}</td>
      <td>
        <div
          className="form-check"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            checked={showSelected()}
            onChange={handleSelected}
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckChecked"
          />
        </div>
      </td>
    </tr>
  );
}
