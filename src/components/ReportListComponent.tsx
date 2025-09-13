import { DocumentDownload, SaveAdd, Trash } from "iconsax-react";
import { useLocation } from "react-router-dom";
import { ModalDeleteComponent, RowComponent, SpaceComponent, TextComponent } from ".";
import { colors } from "../constants/colors";

export default function ReportListComponent() {
  const location = useLocation();
  const { title } = location.state || {};

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
          <option defaultValue=''>Chọn tháng</option>
          <option value="1">01/2024</option>
          <option value="2">02/2024</option>
          <option value="3">03/2024</option>
        </select>
      </RowComponent>

      <div style={{ maxHeight: '85%', overflowY: 'scroll' }}>
        <table className="table">
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Mục tiêu</th>
              <th scope="col">Mức độ hỗ trợ</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Tổng kết</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: 'justify' }}>
            {/* {
              Array.from({ length: 20 }).map((_, index) =>
                <ReportItemComponent type={type} key={index} />
              )
            } */}
          </tbody>
        </table>
      </div>

      <RowComponent justify="flex-end">
        <button
          type="button"
          className="btn btn-success"
          data-bs-dismiss="modal"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SaveAdd size={20} color={colors.bacground} />
          <SpaceComponent width={6} />
          <TextComponent text="Lưu" color={colors.bacground} />
        </button>
        <SpaceComponent width={10} />
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

      <ModalDeleteComponent data={{id:''}}/>
    </div>
  );
}
