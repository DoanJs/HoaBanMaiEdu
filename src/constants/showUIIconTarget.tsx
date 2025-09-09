import {
  Airpods,
  Hierarchy,
  Message,
  Message2,
  Notepad2,
  Profile2User,
} from "iconsax-react";
import { colors } from "./colors";

export const showUIIconTarget = (title: string) => {
  let result: any;
  switch (title) {
    case "Ngôn ngữ hiểu":
      result = <Message size={30} color={colors.textBold} variant="Bold" />;
      break;
    case "Ngôn ngữ diễn đạt":
      result = <Message2 size={30} color={colors.textBold} variant="Bold" />;
      break;
    case "Nhận thức":
      result = <Hierarchy size={30} color={colors.textBold} variant="Bold" />;

      break;
    case "Vận động tinh":
      result = <Notepad2 size={30} color={colors.textBold} variant="Bold" />;
      break;
    case "Giao tiếp sớm":
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
