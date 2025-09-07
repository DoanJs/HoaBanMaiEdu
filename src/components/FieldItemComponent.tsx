import { Link } from "react-router-dom";
import { ProcessBar, RowComponent, SpaceComponent, TextComponent } from ".";
import { colors } from "../constants/colors";
import { showUIIconTarget } from "../constants/showUIIconTarget";
import { sizes } from "../constants/sizes";

interface Props {
  title: string;
  icon: string;
}

export default function FieldItemComponent(props: Props) {
  const { title, icon } = props;
  return (
    <div>
      <Link
        to={"../target"}
        state={{
          title,
          icon,
        }}
        style={{
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
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
        <RowComponent
          styles={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>{showUIIconTarget(icon)}</div>
          <SpaceComponent width={6} />
          <TextComponent
            text={title}
            size={sizes.thinTitle}
            color={colors.textBold}
            styles={{ textAlign: "center", fontWeight: "bold" }}
          />
        </RowComponent>

        <ProcessBar />
      </Link>
    </div>
  );
}
