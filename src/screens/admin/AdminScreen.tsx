import { ReactNode, useState } from "react";
import { AdminChildren, AdminTarget } from "..";
import { RowComponent, SpaceComponent, TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import AdminMeta from "./AdminMeta";
import AdminSuggest from "./AdminSuggest";
import AdminTeacher from "./AdminTeacher";
import AdminBackupData from "./AdminBackupData";
export default function AdminScreen() {
  const [selected, setSelected] = useState("TRẺ");

  const showScreenAdmin = (key: string) => {
    let ui: ReactNode;
    switch (key) {
      case "TRẺ":
        ui = <AdminChildren />;
        break;
      case "LĨNH VỰC - MỤC TIÊU - GỢI Ý":
        ui = <AdminTarget />;
        break;
      case "GỢI Ý":
        ui = <AdminSuggest />;
        break;
      case "GIÁO VIÊN":
        ui = <AdminTeacher />;
        break;
      case "META":
        ui = <AdminMeta />;
        break;
      case "BACKUP_DATA":
        ui = <AdminBackupData />;
        break;

      default:
        break;
    }

    return ui;
  };

  return (
    <div
      style={{
        paddingTop: "1%",
        width: "100%",
      }}
    >
      <RowComponent
        styles={{
          width: "100%",
          borderBottom: "1px solid",
          borderBottomColor: colors.gray,
          paddingBottom: 10,
        }}
      >
        {[
          "TRẺ",
          "LĨNH VỰC - MỤC TIÊU - GỢI Ý",
          "GỢI Ý",
          "GIÁO VIÊN",
          // "KẾ HOẠCH",
          // "BÁO CÁO",
          // "MỨC ĐỘ HỖ TRỢ",
          "META",
          'BACKUP_DATA'
        ].map((_, index) => (
          <button
            key={index}
            onClick={() => setSelected(_)}
            style={{
              borderWidth: 0,
              borderRadius: 6,
              background: selected === _ ? colors.primary : colors.bacground,
              borderColor: "coral",
            }}
          >
            <TextComponent
              text={_}
              styles={{ fontWeight: "bold", padding: widthSmall ? 4 : 10 }}
              size={widthSmall ? sizes.text : sizes.bigText}
              color={selected === _ ? colors.bacground : colors.primary}
            />
          </button>
        ))}
      </RowComponent>
      <SpaceComponent height={4} />

      {showScreenAdmin(selected)}
    </div>
  );
}
