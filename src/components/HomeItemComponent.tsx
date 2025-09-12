import { Bank, Calendar1, Chart, Document, Gallery, Setting2, ShoppingCart } from "iconsax-react";
import { Link } from "react-router-dom";
import { SpaceComponent, TextComponent } from ".";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import useCartStore from "../zustand/useCartStore";

interface Props {
  title: string;
  icon: string;
  value: string;
  onClick: (val: string) => void;
}

export default function HomeItemComponent(props: Props) {
  const { title, icon, value, onClick } = props;
  const {carts} = useCartStore()

  const showUI = () => {
    let result: any;
    let navigate: string;
    switch (icon) {
      case "bank":
        result = (
          <Bank
            size={26}
            color={
              value === title ? colors.primaryLightOpacity : colors.textBold
            }
            variant="Bold"
          />
        );
        navigate = "bank";
        break;
      case "plan":
        result = (
          <Document
            size={26}
            color={
              value === title ? colors.primaryLightOpacity : colors.textBold
            }
            variant="Bold"
          />
        );
        navigate = "plan";
        break;
      case "chart":
        result = (
          <Chart
            size={26}
            color={
              value === title ? colors.primaryLightOpacity : colors.textBold
            }
            variant="Bold"
          />
        );
        navigate = "report";
        break;
      case "callover":
        result = (
          <Calendar1
            size={26}
            color={
              value === title ? colors.primaryLightOpacity : colors.textBold
            }
            variant="Bold"
          />
        );
        navigate = "callover";
        break;
      case "image":
        result = (
          <Gallery
            size={26}
            color={
              value === title ? colors.primaryLightOpacity : colors.textBold
            }
            variant="Bold"
          />
        );
        navigate = "media";
        break;
      case "cart":
        result = (
          <div style={{ position: "relative" }}>
            <ShoppingCart
              size={26}
              color={
                value === title ? colors.primaryLightOpacity : colors.textBold
              }
              variant="Bold"
            />
            <div
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                background: colors.red,
                height: 20,
                width: 20,
                borderRadius: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextComponent
                text={`${carts.length}`}
                size={10}
                color={colors.bacground}
                styles={{ fontWeight: "bold" }}
              />
            </div>
          </div>
        );
        navigate = "cart";
        break;
      default:
        result = (
          <Setting2
            size={26}
            color={
              value === title ? colors.primaryLightOpacity : colors.textBold
            }
            variant="Bold"
          />
        );
        navigate = "setting";
        break;
    }

    return { result, navigate };
  };

  return (
    <Link
      to={showUI().navigate}
      onClick={() => onClick(title)}
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        padding: 16,
        borderRadius: 10,
        height: 80,
        width: "100%",
        background: value === title ? colors.primaryBold : colors.primaryLight,
        cursor: "pointer",
        justifyContent: "flex-start",
      }}
    >
      {showUI().result}
      <SpaceComponent width={6} />
      <TextComponent
        text={title}
        size={sizes.thinTitle}
        color={colors.text}
        styles={{ fontWeight: "bold" }}
      />
    </Link>
  );
}
