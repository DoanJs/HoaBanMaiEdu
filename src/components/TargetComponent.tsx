import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../constants/colors";
import { showUIIconTarget } from "../constants/showUIIconTarget";
import RowComponent from "./RowComponent";
import SpaceComponent from "./SpaceComponent";
import TextComponent from "./TextComponent";

export default function TargetComponent() {
  const location = useLocation();
  const navigate = useNavigate();

  const { title, icon } = location.state || {};

  const handleAddTarget = () => {
    navigate("../bank");
  };

  const handleRemoveSelect = () => {};
  return (
    <div style={{ width: "100%" }}>
      <RowComponent justify="space-between">
        <RowComponent>
          {showUIIconTarget(icon)}
          <SpaceComponent width={8} />
          <TextComponent text={title.toUpperCase()} size={32} />
        </RowComponent>
        <div style={{width:'30%'}}>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Tìm mục tiêu"
              aria-label="Search"
            />
          </form>
        </div>
      </RowComponent>

      <div
        style={{
          width: "100%",
          overflowY: "scroll",
          height: "85%",
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
            {Array.from({ length: 20 }).map((_, index) => (
              <tr key={index} style={{ color: colors.textBold }}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Iusto deserunt et reiciendis, facilis tempore itaque iste
                  officia ut perferendis nostrum nam doloribus praesentium
                  dolore sed aliquid voluptates necessitatibus sapiente culpa.
                </td>
                <td style={{ textAlign: "center" }}>2</td>
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
                      onChange={() => {}}
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                    />
                  </div>
                </td>
              </tr>
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
