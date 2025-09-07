import { CartItemComponent, ModalDeleteComponent, RowComponent } from "../../components";

export default function CartScreen() {
  const handleAddPlan = () => {
    console.log('handleAddPlan')
  }
  return (
    <div style={{ width: "100%" }}>
      <div style={{ height: "90%", overflowY: "scroll" }}>
        <table className="table">
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th scope="col">STT</th>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Mục tiêu</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <CartItemComponent key={index} />
            ))}
          </tbody>
        </table>
      </div>

      <RowComponent
        justify="flex-end"
        styles={{ padding: 20 }}
        onClick={handleAddPlan}
      >
        <button type="button" className="btn btn-primary">
          Tạo mới
        </button>
      </RowComponent>

      <ModalDeleteComponent />
    </div>
  );
}
