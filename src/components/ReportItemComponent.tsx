import { DocumentDownload, Edit, Trash } from "iconsax-react";
import { useLocation } from "react-router-dom";
import {
  ModalDeleteComponent,
  ModalEditComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from ".";
import { colors } from "../constants/colors";

export default function ReportItemComponent() {
  const location = useLocation();

  const { type, title } = location.state || {};
  return (
    <div style={{ width: "100%" }}>
      <RowComponent
        justify="space-between"
        styles={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          width: "100%",
          padding: 10,
          borderBottom: "1px solid",
          borderBottomColor: colors.gray,
        }}
      >
        <TextComponent text={`${title}`} size={32} />
        <select
          className="form-select"
          aria-label="Default select example"
          style={{ width: "20%" }}
        >
          <option selected>Chọn tháng</option>
          <option value="1">01/2024</option>
          <option value="2">02/2024</option>
          <option value="3">03/2024</option>
        </select>
      </RowComponent>

      <div>
        <table className="table">
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Mục tiêu</th>
              <th scope="col">Nội dung</th>
              {type === "BC" && <th scope="col">Tổng kết</th>}
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope="row">Ngôn ngữ hiểu</td>
              <td>
                Con có thể mô tả đơn giản về món ăn/đồ vật mà con yêu thích dựa
                vào những đặc điểm: Màu sắc, hình dạng, kích thước, công
                dụng,... Con đạt 3/5 cơ hội liên tiếp trong 3 ngày. VD: Con
                thích ăn một cây kem màu nâu, mùi chocola có vị ngọt/Con thích
                chơi tàu hỏa, nó có màu xanh dương, nó dài có nhiều toa tàu, để
                chở hàng.
              </td>
              <td>
                Các hoạt động vui chơi tương tác với bạn, cô hỗ trợ tạo tình
                huống dẫn đến các sự việc giúp con hứng thú và ghi nhớ, kết thúc
                hoạt động cô hỏi- đáp và gợi ý để con kể lại.
              </td>
              {type === "BC" && (
                <td>
                  Khi muốn đồ ăn/đồ vật yêu thích con có thể mô tả dựa vào những
                  đặc điểm như: Kích thước, hình dạng, màu sắc, mùi vị… và nói
                  lên cảm nhận của mình. Ví dụ: Con thích ăn kẹo có màu nâu, có
                  vị ngọt, mùi café ăn rất là ngon/ Con thích ăn cơm với cá chấm
                  nước mắm/ Con thích ăn đùi gà rán màu vàng, chấm tương ớt cay
                  uống trà sữa/con thích chơi xây cây cầu dài xe container chạy…
                  Con thực hiện được 3/5 cơ hội, đạt 60% mục tiêu yêu cầu, có
                  tính liên tục và duy trì. Trong những tình huống hoạt động
                  hàng ngày, người lớn tạo cơ hội để con có thể nói lên mong
                  muốn của bản thân cách rõ ràng. - Sau khi tham gia hoạt động
                  cùng với em/bạn, cô hỏi về những sự việc có trong truyện,
                  thỉnh thoảng con nhớ được chuỗi sự việc và kể lại. Ví dụ: Con
                  chơi hứng vịt với em Bắp, có cô Lài với em Bánh Bao, em Bánh
                  Bao phá bị cô Lài la, cô P la/ Con vừa chơi nấu ăn với em Bắp,
                  con thích ăn đùi gà, em Bắp ăn trứng còn cô P ăn cơm với bánh
                  bao, uống sữa, con mời cô Lài ăn thịt… Tuy nhiên, cần cô hỗ
                  trợ mớm từ kết nối hoặc gợi ý bằng câu hỏi thì con mới có thể
                  diễn đạt trọn vẹn chuỗi các sự việc. Con thực hiện được 3/5 cơ
                  hội, tần suất đạt 60% mục tiêu yêu cầu nhưng chưa có tính liên
                  tục và duy trì.
                </td>
              )}
              <td style={{ textAlign: "center" }}>
                <div
                  style={{ cursor: "pointer" }}
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                >
                  <Edit size={20} color={colors.orange} />
                </div>
              </td>
            </tr>
            {/* <tr>
              <td scope="row">Vận động tinh</td>
              <td>Cầm bút vẽ đường thằng</td>
              <td>Luyện kỹ năng viết cơ bản</td>
              <td>Hoàn thành, chuyển sang viết vòng tròn</td>
              <td style={{ textAlign: "center" }}>
                <div style={{ cursor: "pointer" }}>
                  <Edit size={20} color={colors.orange} />
                </div>
              </td>
            </tr>
            <tr>
              <td scope="row">Giao tiếp sớm</td>
              <td>Xếp chồng 4 khối vuông</td>
              <td>Thực hành điều phối tay mát</td>
              <td>Tiếp tục phát huy</td>
              <td style={{ textAlign: "center" }}>
                <div style={{ cursor: "pointer" }}>
                  <Edit size={20} color={colors.orange} />
                </div>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>

      <RowComponent justify="flex-end">
        <button
          type="button"
          className="btn btn-danger"
          data-bs-dismiss="modal"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Trash size={20} color={colors.bacground} />
          <SpaceComponent width={6} />
          <TextComponent text="Xóa" color={colors.bacground} />
        </button>

        <SpaceComponent width={10} />

        <button
          type="button"
          className="btn btn-primary"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DocumentDownload size={20} color={colors.bacground} />
          <SpaceComponent width={6} />
          <TextComponent text="Xuất File" color={colors.bacground} />
        </button>
      </RowComponent>

      <ModalDeleteComponent />
      <ModalEditComponent />
    </div>
  );
}
