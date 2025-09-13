import { useNavigate } from "react-router-dom";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import usePlanStore from "../../zustand/usePlanStore";

interface Props {
  data: any;
}

export default function ModalDeleteComponent(props: Props) {
  const { data } = props;
  const navigate = useNavigate();
  const { removePlan } = usePlanStore();

  const handleDelete = async () => {
    switch (data.nameCollect) {
      case "plans":
        removePlan(data.id);
        await deleteDocData({
          nameCollect: "plans",
          id: data.id,
          metaDoc: "plans",
        });

        navigate("../plan");
        break;

      default:
        break;
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Xóa dữ liệu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            Cô có chắc chắn sẽ xóa dữ liệu này không ?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={handleDelete}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
