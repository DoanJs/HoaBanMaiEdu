import { AddCircle } from "iconsax-react";
import { RowComponent, SpaceComponent, TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { Link } from "react-router-dom";
import { sizes } from "../../constants/sizes";

export default function ReportScreen() {
  return (
    <div>
      <RowComponent
        justify="space-between"
        styles={{
          padding: 10,
          alignItems: "center",
          borderBottom: "1px solid",
          borderBottomColor: colors.gray,
        }}
      >
        <div className="input-group" style={{ width: "30%" }}>
          <span className="input-group-text" id="basic-addon1">
            Tìm tháng
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tháng"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
        <RowComponent styles={{ cursor: "pointer" }}>
          <AddCircle size={30} color={colors.primary} variant="Bold" />
          <SpaceComponent width={4}/>
          <TextComponent text="Thêm mới" size={sizes.thinTitle}/>
        </RowComponent>
      </RowComponent>

      <RowComponent styles={{ display: "flex", flexWrap: "wrap" }}>
        {Array.from({ length: 20 }).map((_, index) => (
          <Link
            to={"../reportItem"}
            state={{
              type: 'BC',
              title: `BC ${index + 1 < 10 ? `0${index + 1}` : index + 1}/2025`
        }}
            key={index}
            type="button"
            className="btn "
            style={{
              background: colors.primaryLightOpacity,
              border: "1px solid coral",
              fontWeight: "bold",
              margin: 10,
            }}
          >
            BC {index + 1 < 10 ? `0${index + 1}` : index + 1}/2025
          </Link>
        ))}
      </RowComponent>
    </div>
  );
}
