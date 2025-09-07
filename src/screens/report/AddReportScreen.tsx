import { RowComponent, SpaceComponent, TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";

export default function AddReportScreen() {
  const handleAddReport = () => {
    console.log("ok");
  };
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <RowComponent
        justify="flex-start"
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
        <TextComponent
          text="Tạo báo cáo tháng"
          size={sizes.title}
          styles={{ fontWeight: "bold" }}
        />
        <SpaceComponent width={10} />
        <select
          className="form-select"
          aria-label="Default select example"
          style={{ width: "20%" }}
        >
          <option defaultValue={""}>Chọn kế hoạch tháng</option>
          <option value="1">KH 01/2024</option>
          <option value="2">KH 02/2024</option>
          <option value="3">KH 03/2024</option>
        </select>
      </RowComponent>

      <div style={{ height: "90%", overflowY: "scroll" }}>
        <table className="table">
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Mục tiêu</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Tổng kết</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                <td scope="row">Ngôn ngữ hiểu</td>
                <td>
                  Con có thể mô tả đơn giản về món ăn/đồ vật mà con yêu thích
                  dựa vào những đặc điểm: Màu sắc, hình dạng, kích thước, công
                  dụng,... Con đạt 3/5 cơ hội liên tiếp trong 3 ngày. VD: Con
                  thích ăn một cây kem màu nâu, mùi chocola có vị ngọt/Con thích
                  chơi tàu hỏa, nó có màu xanh dương, nó dài có nhiều toa tàu,
                  để chở hàng.
                </td>
                <td>
                  Các hoạt động vui chơi tương tác với bạn, cô hỗ trợ tạo tình
                  huống dẫn đến các sự việc giúp con hứng thú và ghi nhớ, kết
                  thúc hoạt động cô hỏi- đáp và gợi ý để con kể lại.
                </td>
                <td>
                  <textarea
                    className="form-control"
                    placeholder="Nhập đánh giá"
                    rows={6}
                    cols={400}
                    id="floatingTextarea2"
                  ></textarea>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RowComponent
        justify="flex-end"
        styles={{ padding: 20 }}
        onClick={handleAddReport}
      >
        <button type="button" className="btn btn-primary">
          Tạo mới
        </button>
      </RowComponent>
    </div>
  );
}
