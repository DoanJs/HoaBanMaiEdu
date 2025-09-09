import { AddCircle } from "iconsax-react";
import { Link } from "react-router-dom";
import { RowComponent, SearchComponent, SpaceComponent, TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";
import useSelectTargetStore from "../../zustand/useSelectTargetStore";

export default function PlanScreen() {
  const { setSelectTarget } = useSelectTargetStore();
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
        <SearchComponent placeholder="Nhập tháng" title="Tìm tháng"/>
        <Link
          to={"../bank"}
          style={{
            cursor: "pointer",
            display: "flex",
            textDecoration: "none",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setSelectTarget("NGÂN HÀNG MỤC TIÊU")}
        >
          <AddCircle size={30} color={colors.primary} variant="Bold" />
          <SpaceComponent width={4} />
          <TextComponent text="Thêm mới" size={sizes.bigText} />
        </Link>
      </RowComponent>

      <RowComponent styles={{ display: "flex", flexWrap: "wrap" }}>
        {Array.from({ length: 20 }).map((_, index) => (
          <Link
            to={"../reportList"}
            state={{
              type: "KH",
              title: `KH ${index + 1 < 10 ? `0${index + 1}` : index + 1}/2025`,
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
            KH {index + 1 < 10 ? `0${index + 1}` : index + 1}/2025
          </Link>
        ))}
      </RowComponent>
    </div>
  );
}
