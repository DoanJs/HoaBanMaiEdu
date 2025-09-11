import { useLocation, useNavigate } from "react-router-dom";
import { showUIIconTarget } from "../constants/showUIIconTarget";
import RowComponent from "./RowComponent";
import SearchComponent from "./SearchComponent";
import SpaceComponent from "./SpaceComponent";
import TargetItemComponent from "./TargetItemComponent";
import TextComponent from "./TextComponent";
import useTargetStore from "../zustand/useTargetStore";
import { TargetModel } from "../models/TargetModel";

export default function TargetComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { targets } = useTargetStore();

  const { title, fieldId } = location.state || {};

  const handleAddTarget = () => {
    navigate("../bank");
  };

  const handleRemoveSelect = () => {};
  return (
    <div style={{ width: "100%" }}>
      <RowComponent justify="space-between" styles={{ paddingTop: 10 }}>
        <RowComponent>
          {showUIIconTarget(title)}
          <SpaceComponent width={8} />
          <TextComponent text={title.toUpperCase()} size={32} />
        </RowComponent>
        <SearchComponent placeholder="Nhập mục tiêu " title="Tìm mục tiêu" onChange={() => {}} arrSource={[]}/>
      </RowComponent>

      <div
        style={{
          width: "100%",
          overflowY: "scroll",
          height: "82%",
        }}
      >
        <table className="table">
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">STT</th>
              <th scope="col">Tên mục tiêu</th>
              <th scope="col">Level</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {targets.length > 0 &&
              targets
                .filter((target: TargetModel) => target.fieldId === fieldId)
                .map((_, index) => (
                  <TargetItemComponent index={index} key={index} target={_}/>
                ))}
          </tbody>
        </table>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-danger"
          data-bs-dismiss="modal"
          onClick={handleRemoveSelect}
        >
          Bỏ chọn tất cả
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddTarget}
        >
          Thêm vào giỏ mục tiêu
        </button>
      </div>
    </div>
  );
}
