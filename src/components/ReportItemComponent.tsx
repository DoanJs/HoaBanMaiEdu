import { colors } from "../constants/colors";

interface Props {
  type: string
}

export default function ReportItemComponent(props: Props) {
  const { type } = props

  return (
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
      <td>Mức độ hỗ trợ</td>
      <td>
        {
          type === 'KH' ?
            <textarea
            onChange={() => {}}
              className="form-control"
              placeholder="Nhập đánh giá"
              rows={6}
              cols={200}
              style={{ borderColor: colors.primary }}
              id="floatingTextarea2"
              value={`Các hoạt động vui chơi tương tác với bạn, cô hỗ trợ tạo tình huống dẫn đến các sự việc giúp con hứng thú và ghi nhớ, kết thúc hoạt động cô hỏi- đáp và gợi ý để con kể lại.`}></textarea>
            : <>
              Các hoạt động vui chơi tương tác với bạn, cô hỗ trợ tạo tình huống dẫn đến các sự việc giúp con hứng thú và ghi nhớ, kết thúc hoạt động cô hỏi- đáp và gợi ý để con kể lại.
            </>

        }
      </td>
      {type === "BC" && (
        <td>
          <textarea
          onChange={() => {}}
            className="form-control"
            placeholder="Nhập đánh giá"
            rows={6}
            cols={400}
            style={{ borderColor: colors.primary }}
            id="floatingTextarea2"
            value={`Khi muốn đồ ăn/đồ vật yêu thích con có thể mô tả dựa vào những đặc điểm như: Kích thước, hình dạng, màu sắc, mùi vị… và nói lên cảm nhận của mình. Ví dụ: Con thích ăn kẹo có màu nâu, có vị ngọt, mùi café ăn rất là ngon/ Con thích ăn cơm với cá chấm nước mắm/ Con thích ăn đùi gà rán màu vàng, chấm tương ớt cay uống trà sữa/con thích chơi xây cây cầu dài xe container chạy… Con thực hiện được 3/5 cơ hội, đạt 60% mục tiêu yêu cầu, có tính liên tục và duy trì. Trong những tình huống hoạt động hàng ngày, người lớn tạo cơ hội để con có thể nói lên mong muốn của bản thân cách rõ ràng.
- Sau khi tham gia hoạt động cùng với em/bạn, cô hỏi về những sự việc có trong truyện, thỉnh thoảng con nhớ được chuỗi sự việc và kể  lại. Ví dụ: Con chơi hứng vịt với em Bắp, có cô Lài với em Bánh Bao, em Bánh Bao phá bị cô Lài la, cô P la/ Con vừa chơi nấu ăn với em Bắp, con thích ăn đùi gà, em Bắp ăn trứng còn cô P ăn cơm với bánh bao, uống sữa, con mời cô Lài ăn thịt… Tuy nhiên, cần cô hỗ trợ mớm từ kết nối hoặc gợi ý bằng câu hỏi thì con mới có thể diễn đạt trọn vẹn chuỗi các sự việc. Con thực hiện được 3/5 cơ hội, tần suất đạt 60% mục tiêu yêu cầu nhưng chưa có tính liên tục và duy trì.`}
          ></textarea>
        </td>
      )}
    </tr>
  );
}
