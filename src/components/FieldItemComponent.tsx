import { Link } from "react-router-dom";
import { RowComponent, SpaceComponent, TextComponent } from ".";
import { colors } from "../constants/colors";
import { showUIIconTarget } from "../constants/showUIIconTarget";
import { sizes } from "../constants/sizes";

interface Props {
  title: string;
  fieldId: string;
}

export default function FieldItemComponent(props: Props) {
  const { title, fieldId } = props;

  return (
    <div>
      <Link
        to={"../target"}
        state={{
          title,
          fieldId,
        }}
        style={{
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: colors.primaryLightOpacity,
          width: 240,
          height: 240,
          padding: 16,
          borderRadius: 10,
          margin: 10,
          border: "1px solid coral",
          cursor: "pointer",
        }}
      >
        <div>{showUIIconTarget(title)}</div>
        <RowComponent
          styles={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SpaceComponent width={6} />
          <TextComponent
            text={title}
            size={sizes.thinTitle}
            color={colors.textBold}
            styles={{ textAlign: "center", fontWeight: "bold" }}
          />
        </RowComponent>

        {/* <ProcessBar /> */}
      </Link>
    </div>
  );
}
