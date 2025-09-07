import {
  Airpods,
  Hierarchy,
  Message,
  Message2,
  Notepad2,
  Profile2User,
} from "iconsax-react";
import { colors } from "./colors";

export const showUIIconTarget = (icon: string) => {
  let result: any;
  switch (icon) {
    case "message":
      result = <Message size={30} color={colors.textBold} variant="Bold" />;
      break;
    case "message2":
      result = <Message2 size={30} color={colors.textBold} variant="Bold" />;
      break;
    case "hierarchy":
      result = <Hierarchy size={30} color={colors.textBold} variant="Bold" />;

      break;
    case "notepad2":
      result = <Notepad2 size={30} color={colors.textBold} variant="Bold" />;
      break;
    case "profile2User":
      result = (
        <Profile2User size={30} color={colors.textBold} variant="Bold" />
      );
      break;
    default:
      result = <Airpods size={30} color={colors.textBold} variant="Bold" />;
      break;
  }
  return result;
};
