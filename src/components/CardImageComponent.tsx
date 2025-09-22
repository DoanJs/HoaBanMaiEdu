import { Notification } from "iconsax-react";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { SpaceComponent, TextComponent } from ".";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { PlanModel, ReportModel } from "../models";
import { ChildrenModel } from "../models/ChildrenModel";

interface Props {
  childInfo: ChildrenModel;
  link: string;
  styles?: CSSProperties;
  imgStyles?: CSSProperties;
  plansTotal: PlanModel[],
  reportsTotal: ReportModel[]
}

export default function CardImageComponent(props: Props) {
  const { childInfo, link, styles, imgStyles, plansTotal, reportsTotal } = props;


  const handleShowNotification = () => {
    const arrayPending = plansTotal.concat(reportsTotal).filter((_) => _.status === 'pending')
    const indexTotal = arrayPending.findIndex((_) => _.childId === childInfo.id)
    if (indexTotal !== -1) {
      return true
    } else {
      return false
    }
  }
  return (
    <Link
      to={link}
      state={{ childInfo }}
      style={{
        textDecoration: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
        position: 'relative',
        ...styles,
      }}
    >
      {
        handleShowNotification() &&
        <div style={{
          position: 'absolute',
          top: -10,
          right: -10
        }}>
          <Notification size={sizes.bigTitle} color={colors.red} variant="Bold" />
        </div>
      }
      <img
        alt=""
        src={childInfo.avatar}
        style={{
          height: 200,
          width: 200,
          objectFit: "cover",
          borderRadius: 10,
          ...imgStyles,
        }}
      />
      <SpaceComponent height={8} />
      <TextComponent
        text={childInfo.fullName}
        size={sizes.bigText}
        styles={{ fontWeight: "bold" }}
      />
    </Link>
  );
}
