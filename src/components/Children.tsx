import { Link } from "react-router-dom";
import {
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from ".";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";

export default function Children() {
  return (
    <SectionComponent
      styles={{
        padding: 100,
        background: colors.primary,
        display: "flex",
        flex: 1,
        height: sizes.height,
      }}
    >
      <RowComponent
        styles={{
          background: colors.bacground,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: 24,
        }}
      >
        <TextComponent
          text="Cô Trần Thị My Ny _ Giám đốc"
          size={32}
          styles={{ fontWeight: "bold" }}
        />
        <SpaceComponent height={30} />
        <div className="input-group mb-3" style={{ width: "30%" }}>
          <span className="input-group-text" id="basic-addon1">
            Tìm trẻ
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên trẻ"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
        <RowComponent
          styles={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            height: "90%",
            overflow: 10 > 11 ? "scroll" : "hidden",
            alignItems: "flex-start",
          }}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <Link
              to={"/home"}
              key={index}
              style={{
                textDecoration: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: 10,
              }}
            >
              <img
                src="voi.jpg"
                style={{ height: 60, width: 60, borderRadius: 100 }}
              />
              <SpaceComponent height={8} />
              <TextComponent
                text="An"
                size={16}
                styles={{ fontWeight: "bold" }}
              />
            </Link>
          ))}
        </RowComponent>
      </RowComponent>
    </SectionComponent>
  );
}
