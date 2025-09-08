import { AddCircle } from "iconsax-react";
import { CalloverItemComponent, ModalEditCallover, RowComponent, SectionComponent, SpaceComponent, TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";

export default function CalloverScreen() {
  return (
    <SectionComponent styles={{ width: '100%' }}>
      <RowComponent justify="space-between" styles={{ padding: 20 }}>
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

        <RowComponent justify="center">
          <RowComponent>
            <TextComponent text="Tổng số giờ học: " size={sizes.thinTitle} />
            <SpaceComponent width={10} />
            <TextComponent text="28 " size={sizes.thinTitle} styles={{ fontWeight: 'bold' }} />
          </RowComponent>
          <SpaceComponent width={36} />
          <RowComponent>
            <TextComponent text="Tổng số giờ nghỉ: " size={sizes.thinTitle} />
            <SpaceComponent width={10} />
            <TextComponent text="2 " size={sizes.thinTitle} styles={{ fontWeight: 'bold' }} />
          </RowComponent>
        </RowComponent>

        <RowComponent
          styles={{
            cursor: "pointer",
            display: "flex",
            textDecoration: "none",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AddCircle size={30} color={colors.primary} variant="Bold" />
          <SpaceComponent width={4} />
          <TextComponent text="Thêm tháng mới" size={sizes.bigText} />
        </RowComponent>
      </RowComponent>

      <div style={{ alignItems: 'center', maxHeight: '85%', overflowY: 'scroll' }}>
        <table className="table table-bordered">
          <thead>
            <tr style={{ background: colors.primaryLight, textAlign: 'center' }}>
              <th scope="col">T2</th>
              <th scope="col">T3</th>
              <th scope="col">T4</th>
              <th scope="col">T5</th>
              <th scope="col">T6</th>
              <th scope="col">T7</th>
              <th scope="col">CN</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: 'center' }}>
            {
              Array.from({ length: 5 }).map((_, index) =>
                <tr key={index}>
                  <td>
                    <CalloverItemComponent />
                  </td>
                  <td><CalloverItemComponent /></td>
                  <td><CalloverItemComponent /></td>
                  <td><CalloverItemComponent /></td>
                  <td><CalloverItemComponent /></td>
                  <td><CalloverItemComponent /></td>
                  <td><CalloverItemComponent /></td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

      <ModalEditCallover />
    </SectionComponent>
  );
}
