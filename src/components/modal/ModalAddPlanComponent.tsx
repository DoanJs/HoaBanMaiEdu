import { useState } from "react";

export default function ModalAddPlanComponent() {
  const [title, setTitle] = useState('');
  return (
    <div
      className="modal fade"
      id="addPlanModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Vui lòng nhập tên kế hoạch
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="form-control"
              placeholder="VD: KH 09/2025"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
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
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  //   <!-- Button trigger modal -->
  // <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addPlanModal">
  //   Launch demo modal
  // </button>
}
