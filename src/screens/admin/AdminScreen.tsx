import { ReactNode, useState } from "react";
import { AdminChildren, AdminTargetSuggest } from "..";
import { RowComponent, SpaceComponent, TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";
export default function AdminScreen() {
  const [selected, setSelected] = useState('TRẺ');

  const showScreenAdmin = (key: string) => {
    let ui: ReactNode
    switch (key) {
      case 'TRẺ':
        ui = <AdminChildren />
        break;
      case 'LĨNH VỰC - MỤC TIÊU - GỢI Ý':
        ui = <AdminTargetSuggest />
        break;
      case 'GIÁO VIÊN':

        break;
      case 'KẾ HOẠCH':

        break;
      case 'BÁO CÁO':

        break;
      case 'MỨC ĐỘ HỖ TRỢ':

        break;

      default:
        break;
    }

    return ui
  }

  return (
    <div style={{
      paddingTop: '1%',
      width: '100%'
    }}>
      <RowComponent styles={{
        width: '100%',
        borderBottom: '1px solid',
        borderBottomColor: colors.gray,
        paddingBottom: 10
      }}>
        {
          ['TRẺ', 'LĨNH VỰC - MỤC TIÊU - GỢI Ý', 'GIÁO VIÊN', 'KẾ HOẠCH', 'BÁO CÁO', 'MỨC ĐỘ HỖ TRỢ', 'META'].map((_, index) =>
            <button key={index}
              onClick={() => setSelected(_)}
              style={{
                borderWidth: 0,
                borderRadius: 6,
                background: selected === _ ? colors.primary : colors.bacground,
                borderColor: 'coral',
              }}>
              <TextComponent
                text={_} styles={{ fontWeight: 'bold', padding: 10 }}
                size={sizes.bigText} color={selected === _ ? colors.bacground : colors.primary} />
            </button>)
        }
      </RowComponent>
      <SpaceComponent height={10} />

      {showScreenAdmin(selected)}
    </div>
  );
}
