import { Trash } from "iconsax-react";
import { useState } from "react";
import { RowComponent, SpaceComponent } from ".";
import { colors } from "../constants/colors";

export default function CartItemComponent() {
  const [type, setType] = useState("");
  return (
    <tr>
      <td scope="row">1</td>
      <td>Ngôn ngữ hiểu</td>
      <td>
        Con có thể mô tả đơn giản về món ăn/đồ vật mà con yêu thích dựa vào
        những đặc điểm: Màu sắc, hình dạng, kích thước, công dụng,... Con đạt
        3/5 cơ hội liên tiếp trong 3 ngày. VD: Con thích ăn một cây kem màu nâu,
        mùi chocola có vị ngọt/Con thích chơi tàu hỏa, nó có màu xanh dương, nó
        dài có nhiều toa tàu, để chở hàng.
      </td>
      <td style={{ width: "50%" }}>
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
                    onChange={() => {}}
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
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <Trash size={20} color={colors.red} variant="Bold" />
        </div>
      </td>
    </tr>
  );
}
