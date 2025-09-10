import { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { SpaceComponent, TextComponent } from ".";
import { sizes } from "../constants/sizes";

interface Props {
  avatar: string;
  name: string;
  link: string;
  styles?: CSSProperties;
  imgStyles?: CSSProperties;
}

export default function CardImageComponent(props: Props) {
  const { avatar, name, link, styles, imgStyles } = props;
  return (
    <Link
      to={link}
      style={{
        textDecoration: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
        ...styles,
      }}
    >
      <img
        alt=""
        src={avatar}
        style={{ height: 120, width: 120, objectFit: 'cover', borderRadius: 10, ...imgStyles }}
      />
      <SpaceComponent height={8} />
      <TextComponent
        text={name}
        size={sizes.bigText}
        styles={{ fontWeight: "bold" }}
      />
    </Link>
  );
}
