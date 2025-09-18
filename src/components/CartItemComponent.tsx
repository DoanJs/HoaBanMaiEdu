import { Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { RowComponent, SpaceComponent } from ".";
import { colors } from "../constants/colors";
import { convertTargetField } from "../constants/convertTargetAndField";
import { sizes } from "../constants/sizes";
import { SuggestModel } from "../models/SuggestModel";
import { useSuggestStore } from "../zustand";
import useCartStore from "../zustand/useCartStore";
import useFieldStore from "../zustand/useFieldStore";
import useInterventionStore from "../zustand/useInterventionStore";
import useTargetStore from "../zustand/useTargetStore";

interface Props {
  index: number;
  cart: any;
}

export default function CartItemComponent(props: Props) {
  const { index, cart } = props;
  const { fields } = useFieldStore();
  const { removeCart, editCart } = useCartStore();
  const [type, setType] = useState("");
  const [text, setText] = useState('');
  const [suggest, setSuggest] = useState<SuggestModel>();
  const { interventions } = useInterventionStore();
  const { targets } = useTargetStore();
  const { suggests } = useSuggestStore()

  useEffect(() => {
    if (cart && cart.content) {
      setText(cart.content);
      const index = suggests.findIndex((suggest) => suggest.name === cart.content)
      if(index!==-1){
        setSuggest(suggests[index])
        setType('Gợi ý')
      }else{
        setType('Ý khác')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);
  useEffect(() => {
    if (type === "Ý khác" && text) {
      editCart(cart.id, { ...cart, content: text });
    }
    if (type === "Gợi ý" && suggest) {
      editCart(cart.id, { ...cart, content: suggest.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, suggest]);

  const handleSelectIntervention = (val: string) => {
    editCart(cart.id, { ...cart, intervention: val });
  };
  const handleSuggestsWithField = (fieldId: string) => {
    const items = suggests.filter((suggest) => suggest.fieldId === fieldId)
    return items
  }
  return (
    <tr>
      <td>{index + 1}</td>
      <th>{convertTargetField(cart.id, targets, fields).nameField}</th>
      <td>{convertTargetField(cart.id, targets, fields).nameTarget}</td>
      <td style={{ width: "20%" }}>
        <select
          value={cart.intervention}
          className="form-select"
          aria-label="Default select example"
          onChange={(val) => handleSelectIntervention(val.target.value)}
        >
          <option defaultValue={""}>Chọn</option>
          {interventions.length > 0 &&
            interventions.map((_, index) => (
              <option key={index} value={_.name}>
                {_.name}
              </option>
            ))}
        </select>
      </td>
      <td style={{ width: "30%" }}>
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
        <div>
          <SpaceComponent height={8} />
          {type === "Gợi ý" &&
            <Select<SuggestModel>
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id.toString()}
              options={handleSuggestsWithField(cart.fieldId)}
              maxMenuHeight={sizes.height}
              onChange={(val: SingleValue<SuggestModel>) => setSuggest(val as SuggestModel)}
              value={suggest}
            />
          }

          {type === "Ý khác" && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-control"
              placeholder="Nhập đánh giá"
              rows={5}
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
          <Trash
            size={20}
            color={colors.red}
            variant="Bold"
            style={{ cursor: "pointer" }}
          />
        </div>
      </td>
    </tr>
  );
}
