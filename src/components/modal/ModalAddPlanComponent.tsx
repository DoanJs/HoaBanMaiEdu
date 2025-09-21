import { colors } from "../../constants/colors"

interface Props {
  title: string
  setTitle: any
  handleAddEditPlan: () => void
}

export default function ModalAddPlanComponent(props: Props) {
  const { title, setTitle, handleAddEditPlan } = props

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
            <button type="button"
              data-bs-dismiss="modal"
              className="btn btn-primary"
              onClick={title === '' ? undefined : handleAddEditPlan}
              style={{
                backgroundColor: title === '' ? colors.gray : undefined,
                borderColor: title === '' ? colors.gray : undefined,
              }}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
