import { Edit } from "iconsax-react";
import { useState } from "react";
import { RowComponent, SpaceComponent, TextComponent } from ".";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";

export default function CalloverItemComponent() {
  const [isShow, setIsShow] = useState(false);
  return (
    <RowComponent styles={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center'
    }}>
      <TextComponent text="30/12" styles={{ fontWeight: 'bold' }} size={sizes.bigTitle} />
      {
        isShow &&
        <div>
          {/* cô user chính */}
          <TextComponent text="Cô Miền - 1h" />
          {/* 2 cô phụ */}
          <TextComponent text="Cô Miền - 1h" />
          <TextComponent text="Cô Miền - 1h" />
        </div>

      }
      <SpaceComponent height={4} />
      <RowComponent>
        <div
          className="form-check"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            onChange={() => setIsShow(!isShow)}
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckChecked"
          />
        </div>

        {
          isShow &&
          <>
            <SpaceComponent width={20} />
            <Edit size={24} color={colors.orange} style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#staticBackdrop" />
          </>
        }
      </RowComponent>
    </RowComponent>
  );
}
