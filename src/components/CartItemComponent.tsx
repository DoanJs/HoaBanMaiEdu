import { Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { RowComponent, SearchComponent, SpaceComponent } from ".";
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
  const [content, setContent] = useState("");
  const [text, setText] = useState('');
  const [selected, setSelected] = useState('');
  const { interventions } = useInterventionStore();
  const { targets } = useTargetStore();
  const { suggests } = useSuggestStore()
  const [suggestsNew, setSuggestsNew] = useState<SuggestModel[]>([]);

  useEffect(() => {
    if (cart) {
      setContent(cart.content);
      setType('Ý khác')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);
  useEffect(() => {
    if (type === "Ý khác" && content) {
      editCart(cart.id, { ...cart, content: text });
    }
    if (type === 'Gợi ý' && selected) {
      editCart(cart.id, { ...cart, content: selected })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, content]);
  useEffect(() => {
    if (cart) {
      setSuggestsNew(handleSuggestsWithField(cart.fieldId))
    }
  }, [cart])

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
      <td style={{ width: "40%" }}>
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
        <div style={{ height: sizes.height * 30 / 100, overflowY: "scroll", }}>
          <SpaceComponent height={8} />
          {type === "Gợi ý" &&
            <>
              <SearchComponent
                width={'80%'}
                title='Tìm gợi ý' placeholder='Nhập gợi ý'
                type='searchSuggest'
                arrSource={handleSuggestsWithField(cart.fieldId)}
                onChange={(vals) => setSuggestsNew(vals)} />
              <SpaceComponent height={8} />
              {
                suggestsNew.map((_, index) => (
                  <div className="form-check" key={index} style={{ marginLeft: 10 }}>
                    <input
                      value={_.name}
                      onChange={e => setSelected(e.target.value)}
                      checked={selected === _.name} className="form-check-input" type="radio" name="selectedSuggest" id={`selectedSuggest${index}`} />
                    <label className="form-check-label" htmlFor={`selectedSuggest${index}`}>
                      {_.name}
                    </label>
                  </div>
                ))
              }
            </>
          }

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
