import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RowComponent, SearchComponent, SpaceComponent, TargetItemComponent, TextComponent } from ".";
import { showUIIconTarget } from "../constants/showUIIconTarget";
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

  const handleRemoveSelect = () => {
    const items = carts.filter((cart) => cart.fieldId !== fieldId);
    setCarts(items);
  };
  return (
    <div style={{ width: "100%" }}>
      <RowComponent justify="space-between" styles={{ paddingTop: 10 }}>
        <RowComponent>
          {showUIIconTarget(title)}
          <SpaceComponent width={8} />
          <TextComponent text={title.toUpperCase()} size={32} />
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
        >
          Bỏ chọn tất cả
        </button>
      </RowComponent>

      <div
        style={{
          width: "100%",
          overflowY: "scroll",
          height: "82%",
          marginTop: 10
        }}
      >
        <table className="table table-bordered">
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
                .map((_, index) => (
                  <TargetItemComponent index={index} key={index} target={_} />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
