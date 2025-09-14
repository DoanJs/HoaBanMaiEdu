import { Airpods } from "iconsax-react";
import {
  Alphabet,
  Chat,
  Ear,
  Eye,
  Hearts,
  Light,
  Puzzle,
  Universal,
} from "../assets/icons";
import { colors } from "./colors";

export const showUIIconTarget = (title: string) => {
  let result: any;
  switch (title) {
    case "Ngôn ngữ hiểu":
      result = (
        <Ear
          className="w-6 h-6 fill-current"
          fill={colors.textBold}
          width={30}
          height={30}
        />
      );
      break;
    case "Ngôn ngữ diễn đạt":
      result = (
        <Chat
          className="w-6 h-6 fill-current"
          fill={colors.textBold}
          width={30}
          height={30}
        />
      );
      break;
    case "Nhận thức":
      result = (
        <Light
          className="w-6 h-6 fill-current"
          fill={colors.textBold}
          width={30}
          height={30}
        />
      );

      break;
    case "Vận động tinh":
      result = (
        <Puzzle
          className="w-6 h-6 fill-current"
          fill={colors.textBold}
          width={30}
          height={30}
        />
      );
      break;
    case "Chỉnh âm":
      result = (
        <Alphabet
          className="w-6 h-6 fill-current"
          fill={colors.textBold}
          width={30}
          height={30}
        />
      );
      break;
    case "Cá nhân xã hội":
      result = (
        <Hearts
          className="w-6 h-6 fill-current"
          fill={colors.textBold}
          width={30}
          height={30}
        />
      );
      break;
    case "Hành vi":
      result = (
        <Universal
          className="w-6 h-6 fill-current"
          fill={colors.textBold}
          width={30}
          height={30}
        />
      );
      break;
    default:
      result = (
        <Eye
          className="w-6 h-6 fill-current"
          fill={colors.textBold}
          width={30}
          height={30}
        />
      );
      break;
  }
  return result;
};
