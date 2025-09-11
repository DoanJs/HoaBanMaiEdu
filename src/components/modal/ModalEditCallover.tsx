import RowComponent from "../RowComponent";
import SpaceComponent from "../SpaceComponent";

export default function ModalEditCallover() {
  return (
    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Thay đổi điểm danh ngày 30/12/2025</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {
              Array.from({ length: 3 }).map((_, index) =>
                <RowComponent styles={{margin: '10px 0'}} key={index}>
                  <select className="form-select" aria-label="Default select example">
                    <option selected>Chọn giáo viên</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                  <SpaceComponent width={10} />
                  <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Số giờ dạy" />
                  </form>

                </RowComponent>
              )
            }
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" className="btn btn-primary">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}
