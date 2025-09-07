export default function ModalEditComponent() {
  return (
    <div
      className="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Chỉnh sửa dữ liệu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="form-floating">
              <textarea
              style={{height:'100%'}}
                className="form-control"
                rows={20}
                value={`Khi muốn đồ ăn/đồ vật yêu thích con có thể mô tả dựa vào những đặc
            điểm như: Kích thước, hình dạng, màu sắc, mùi vị… và nói lên cảm
            nhận của mình. Ví dụ: Con thích ăn kẹo có màu nâu, có vị ngọt, mùi
            café ăn rất là ngon/ Con thích ăn cơm với cá chấm nước mắm/ Con
            thích ăn đùi gà rán màu vàng, chấm tương ớt cay uống trà sữa/con
            thích chơi xây cây cầu dài xe container chạy… Con thực hiện được 3/5
            cơ hội, đạt 60% mục tiêu yêu cầu, có tính liên tục và duy trì. Trong
            những tình huống hoạt động hàng ngày, người lớn tạo cơ hội để con có
            thể nói lên mong muốn của bản thân cách rõ ràng. - Sau khi tham gia
            hoạt động cùng với em/bạn, cô hỏi về những sự việc có trong truyện,
            thỉnh thoảng con nhớ được chuỗi sự việc và kể lại. Ví dụ: Con chơi
            hứng vịt với em Bắp, có cô Lài với em Bánh Bao, em Bánh Bao phá bị
            cô Lài la, cô P la/ Con vừa chơi nấu ăn với em Bắp, con thích ăn đùi
            gà, em Bắp ăn trứng còn cô P ăn cơm với bánh bao, uống sữa, con mời
            cô Lài ăn thịt… Tuy nhiên, cần cô hỗ trợ mớm từ kết nối hoặc gợi ý
            bằng câu hỏi thì con mới có thể diễn đạt trọn vẹn chuỗi các sự việc.
            Con thực hiện được 3/5 cơ hội, tần suất đạt 60% mục tiêu yêu cầu
            nhưng chưa có tính liên tục và duy trì.`}
                onChange={() => console.log('change')}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button type="button" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
