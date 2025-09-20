import { Link } from "react-router-dom";
import { SpaceComponent, TextComponent } from ".";
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
          width: 180,
          height: 180,
          padding: 16,
          borderRadius: 10,
          margin: 10,
          border: "1px solid coral",
          cursor: "pointer",
        }}
      >
        <div>{showUIIconTarget(title)}</div>
        <SpaceComponent height={20} />
        <TextComponent
          text={title}
          size={sizes.bigText}
          color={colors.textBold}
          styles={{ textAlign: "center", fontWeight: "bold" }}
        />
      </Link>
    </div>
  );
}
