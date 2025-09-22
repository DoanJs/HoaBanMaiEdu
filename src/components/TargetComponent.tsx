import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RowComponent, SearchComponent, SpaceComponent, TargetItemComponent, TextComponent } from ".";
import { deleteDocData } from "../constants/firebase/deleteDocData";
import { widthSmall } from "../constants/reponsive";
import { showUIIconTarget } from "../constants/showUIIconTarget";
import { sizes } from "../constants/sizes";
import { TargetModel } from "../models/TargetModel";
import { useCartStore, useTargetStore } from "../zustand";

export default function TargetComponent() {
  const location = useLocation();
  const { title, fieldId } = location.state || {};
  const { targets } = useTargetStore();
  const [targetsNew, setTargetsNew] = useState<TargetModel[]>([]);
  const { carts, setCarts } = useCartStore();


  useEffect(() => {
    if (targets) {
      setTargetsNew(targets);
    }
  }, [targets]);

  const handleRemoveSelect = async () => {
    const items = carts.filter((cart) => cart.fieldId !== fieldId);
    const itemsRemove = carts.filter((cart) => cart.fieldId === fieldId)
    
    setCarts(items);
    const promiseItems = itemsRemove.map((_) =>
      deleteDocData({
        nameCollect: 'carts',
        id: _.id,
        metaDoc: 'carts'
      }))

    await Promise.all(promiseItems)
  };
  return (
    <div style={{ width: "100%" }}>
      <RowComponent justify="space-between" styles={{ paddingTop: 10 }}>
        <RowComponent>
          {showUIIconTarget(title, widthSmall ? 36 : 52, widthSmall ? 36 : 52)}
          <SpaceComponent width={8} />
          <TextComponent text={title.toUpperCase()} size={widthSmall ? sizes.smallTitle : sizes.bigTitle} />
        </RowComponent>
        <SearchComponent
          placeholder="Nhập mục tiêu "
          title="Tìm mục tiêu"
          onChange={(val) => setTargetsNew(val)}
          type="searchTarget"
          arrSource={targets}
        />

        <button
          type="button"
          className="btn btn-danger"
          data-bs-dismiss="modal"
          onClick={handleRemoveSelect}
          style={{
            fontSize: widthSmall ? sizes.text : undefined
          }}
        >
          Bỏ chọn tất cả
        </button>
      </RowComponent>

      <div
        style={{
          width: "100%",
          overflowY: "scroll",
          height: `${widthSmall ? '82%' : '86%'}`,
          marginTop: 10
        }}
      >
        <table className="table table-bordered" style={{ fontSize: widthSmall ? sizes.text : sizes.bigText }}>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">STT</th>
              <th scope="col">Tên mục tiêu</th>
              <th scope="col">Level</th>
              <th scope="col">Chọn</th>
            </tr>
          </thead>
          <tbody>
            {targetsNew.length > 0 &&
              targetsNew
                .filter((target: TargetModel) => target.fieldId === fieldId)
                .sort((a, b) => a.level - b.level)
                .map((_, index) => (
                  <TargetItemComponent index={index} key={index} target={_} />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
