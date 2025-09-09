import {
  CardImageComponent,
  RowComponent,
  SearchComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";

export default function ChildrenScreen() {
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
          borderRadius: 10,
        }}
      >
        <TextComponent
          text="Cô Trần Thị My Ny _ Giám đốc"
          size={32}
          styles={{ fontWeight: "bold" }}
        />
        <SpaceComponent height={30} />
        <SearchComponent title="Tìm trẻ" placeholder="Nhập tên trẻ" />
        <RowComponent
          styles={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            height: "90%",
            width: "70%",
            overflow: 10 > 11 ? "scroll" : "hidden",
            alignItems: "flex-start",
            overflowY: 3 > 4 ? "scroll" : undefined,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <CardImageComponent
              key={index}
              avatar="voi.jpg"
              name="Nguyễn Kim Trung"
              link="home"
            />
          ))}
        </RowComponent>
      </RowComponent>
    </SectionComponent>
  );
}
