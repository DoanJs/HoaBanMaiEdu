import { Link, Outlet } from "react-router-dom";
import {
  HomeItemComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from ".";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import useEnableHomeItemStore from "../zustand/store";

export default function Navbar() {
  const { enableHomeItem, setEnableHomeItem } = useEnableHomeItemStore();

  return (
    <SectionComponent
      styles={{
        padding: 20,
        background: colors.primary,
        display: "flex",
        flex: 1,
        height: sizes.height,
      }}
    >
      <div style={{ flex: 1, background: colors.primaryLight, padding: 20 }}>
        <RowComponent justify="space-between">
          <Link to={"/"}>
            <img
              alt=""
              src="HBMIcon.jpg"
              style={{
                height: 60,
                width: 60,
                borderRadius: 10,
                marginLeft: 16,
              }}
            />
          </Link>

          <RowComponent>
            <RowComponent
              styles={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="voi.jpg"
                style={{ height: 30, width: 30, borderRadius: 100 }}
              />
              <SpaceComponent height={4} />
              <TextComponent text="An" styles={{ fontWeight: "bold" }} />
            </RowComponent>
            <SpaceComponent width={10} />
            <div>
              <TextComponent
                text="Giáo viên phụ trách:"
                styles={{ fontWeight: "bold" }}
              />
              <TextComponent text="1. Nguyễn Thị Lài" />
              <TextComponent text="2. Thái Thị Miền" />
            </div>
          </RowComponent>

          <RowComponent>
            <RowComponent styles={{ flexDirection: "column" }}>
              <TextComponent text="TRẦN THỊ MY NY" color={colors.textBold} />
              <TextComponent text="Giám đốc" color={colors.textBold} />
            </RowComponent>
            <SpaceComponent width={6} />
            <img
              alt=""
              src="voi.jpg"
              style={{ height: 36, width: 36, borderRadius: 100 }}
            />
          </RowComponent>
        </RowComponent>

        <SpaceComponent height={16} />

        <RowComponent
          styles={{
            flex: 1,
            alignItems: "flex-start",
            borderRadius: 10,
            height: "90%",
          }}
        >
          <SectionComponent
            styles={{ display: "flex", flex: 1, height: "100%" }}
          >
            <RowComponent
              styles={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <RowComponent
                styles={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <HomeItemComponent
                  title="NGÂN HÀNG MỤC TIÊU"
                  icon="bank"
                  value={enableHomeItem}
                  onClick={(val) => setEnableHomeItem(val)}
                />
                <HomeItemComponent
                  title="KẾ HOẠCH"
                  icon="plan"
                  value={enableHomeItem}
                  onClick={(val) => setEnableHomeItem(val)}
                />
                <HomeItemComponent
                  title="BÁO CÁO"
                  icon="chart"
                  value={enableHomeItem}
                  onClick={(val) => setEnableHomeItem(val)}
                />
                <HomeItemComponent
                  title="HÌNH ẢNH/VIDEO"
                  icon="image"
                  value={enableHomeItem}
                  onClick={(val) => setEnableHomeItem(val)}
                />
                <HomeItemComponent
                  title="CÀI ĐẶT"
                  icon="setting"
                  value={enableHomeItem}
                  onClick={(val) => setEnableHomeItem(val)}
                />
              </RowComponent>
              <HomeItemComponent
                title="GIỎ MỤC TIÊU"
                icon="cart"
                value={enableHomeItem}
                onClick={(val) => setEnableHomeItem(val)}
              />
            </RowComponent>
          </SectionComponent>

          <SectionComponent
            styles={{
              display: "flex",
              flex: 4,
              background: colors.bacground,
              borderRadius: 10,
              height: "100%",
            }}
          >
            <Outlet />
          </SectionComponent>
        </RowComponent>
      </div>
    </SectionComponent>
  );
}
