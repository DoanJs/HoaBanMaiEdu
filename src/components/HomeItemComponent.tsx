import {
  Bank,
  Calendar1,
  Chart,
  Document,
  DocumentLike,
  Gallery,
  Notification,
  Setting2,
  ShoppingCart,
} from "iconsax-react";
import { Link } from "react-router-dom";
import { SpaceComponent, TextComponent } from ".";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { usePlanStore, useReportStore } from "../zustand";
import useCartStore from "../zustand/useCartStore";
import { widthSmall } from "../constants/reponsive";

interface Props {
  title: string;
  icon: string;
  value: string;
  onClick: (val: string) => void;
}

export default function HomeItemComponent(props: Props) {
  const { title, icon, value, onClick } = props;
  const { carts } = useCartStore();
  const { plans } = usePlanStore();
  const { reports } = useReportStore();

  const showUI = () => {
    let result: any;
    let navigate: string;
    switch (icon) {
      case "bank":
        result = (
          <Bank
            size={widthSmall ? sizes.smallTitle: sizes.title}
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
            size={widthSmall ? sizes.smallTitle: sizes.title}
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
            size={widthSmall ? sizes.smallTitle: sizes.title}
            color={
              value === title ? colors.primaryLightOpacity : colors.textBold
            }
            variant="Bold"
          />
        );
        navigate = "report";
        break;
      case "pending":
        result = (
          <DocumentLike
            size={widthSmall ? sizes.smallTitle: sizes.title}
            color={
              value === title ? colors.primaryLightOpacity : colors.textBold
            }
            variant="Bold"
          />
        );
        navigate = "pending";
        break;
      case "callover":
        result = (
          <Calendar1
            size={widthSmall ? sizes.smallTitle: sizes.title}
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
            size={widthSmall ? sizes.smallTitle: sizes.title}
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
              size={widthSmall ? sizes.smallTitle: sizes.title}
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
            size={widthSmall ? sizes.smallTitle: sizes.title}
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
  const handleCommentTotal = () => {
    // eslint-disable-next-line
    let isComment: boolean = false;
    plans.concat(reports).map((_) => {
      if (_.comment) {
        isComment = true;
      }
    })

    return isComment;
  };

  return (
    <Link
      to={showUI().navigate}
      onClick={() => onClick(title)}
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        borderRadius: 10,
        height: widthSmall ? 50: 80,
        paddingLeft: 10,
        width: "100%",
        background: value === title ? colors.primaryBold : colors.primaryLight,
        cursor: "pointer",
        justifyContent: "flex-start",
        position: "relative",
      }}
    >
      {title === "CHỜ DUYỆT" && handleCommentTotal() && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: 20,
            height: 20,
            width: 20,
            borderRadius: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Notification color={colors.red} size={26} variant="Bold" />
        </div>
      )}
      {showUI().result}
      <SpaceComponent width={6} />
      <TextComponent
        text={title}
        size={widthSmall ?  sizes.text : sizes.thinTitle}
        color={colors.text}
        styles={{ fontWeight: "bold" }}
      />
    </Link>
  );
}
