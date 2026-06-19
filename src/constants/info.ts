import { FieldValue } from "firebase/firestore";

// types:
export interface PlanCardTheme {
  bg: string;
  color: string;
  icon: string;
}

// variables:
export const CENTER_NAME = "TRUNG TÂM CAN THIỆP SỚM HOA BAN MAI EDU";
export const FIRST_NAME = "TRUNG TÂM CAN THIỆP SỚM";
export const LAST_NAME = "HOA BAN MAI EDU";
export const activeCategoryDefault = "gGNJ5mQZRSxkSW4qAu6F"; //HoaBanMaiEdu
export const indexedDBName = "HBMEdu";
export const ADMINID = "52LPPcC0ejgAWSEoWhWBCT8KHsm2"; //HoaBanMaiEdu
const planCardThemes = [
  {
    bg: "#fdecef",
    color: "#e84c7f",
    icon: "/icons/gim_red.png",
  },
  {
    bg: "#fff8e5",
    color: "#d9a300",
    icon: "/icons/gim_yellow.png",
  },
  {
    bg: "#eef8df",
    color: "#4caf50",
    icon: "/icons/gim_green.png",
  },
  {
    bg: "#edf7ff",
    color: "#2196f3",
    icon: "/icons/gim_blue.png",
  },
  {
    bg: "#f5efff",
    color: "#9c27b0",
    icon: "/icons/gim_violet.png",
  },
  {
    bg: "#fff1ea",
    color: "#ff6f00",
    icon: "/icons/gim_orange.png",
  },
  {
    bg: "#ebfbf8",
    color: "#009688",
    icon: "/icons/gim_cyan.png",
  },
  {
    bg: "#ebfbf8",
    color: "#064617",
    icon: "/icons/gim_white.png",
  },
];
//HoaBanMaiEdu
export const fieldOrder = [
  "gGNJ5mQZRSxkSW4qAu6F", // Ngôn ngữ hiểu
  "3EUhuJoxzHauQpx1pPxq", // Ngôn ngữ diễn đạt
  "zfnX1X3wvP46rRF3k4gB", // Chỉnh âm
  "j6fFXTUD1D6rym4UmKkV", // Nhận thức
  "cyg1PnZ4snHm583dFBzp", // Vận động tinh
  "qw6gesBxUmEgEDow153O", // Cá nhân xã hội
  "Nji6cMUy0TcZ1Tw8B2iG", // Tập trung chú ý
  "48UQhGWIQECsi8lAd7Sc", // Hành vi
];

// functions:
export const getPreviousMonth = () => {
  const now = new Date();
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const month = String(previous.getMonth() + 1).padStart(2, "0");
  const year = previous.getFullYear();

  return `${month}/${year}`;
};
export const getCurrentMonth = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${month}/${year}`;
};

export const getNextMonth = () => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const month = String(next.getMonth() + 1).padStart(2, "0");
  const year = next.getFullYear();

  return `${month}/${year}`;
};

export const formatDateSearch = (time: any) => {
  const timeMs = getTimeMs(time);

  if (!timeMs) return "";

  const date = new Date(timeMs);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${month}/${year} ${year}`;
};

export const handleCommentTotal = (array: any[]) => {
  // eslint-disable-next-line
  let isComment: boolean = false;
  array.map((_: any) => {
    if (_.comment && _.status === "pending") {
      isComment = true;
    }
  });

  return isComment;
};
export const parseVNDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day); // month - 1 vì JS đếm từ 0
};
export const calculateAgeDetail = (birthStr: string) => {
  const birth = parseVNDate(birthStr);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};
export const getCardTheme = (id: string): PlanCardTheme => {
  const hash = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return planCardThemes[hash % planCardThemes.length];
};
type TimeAtModel = {
  seconds: number;
  nanoseconds: number;
};

export const getTimeValue = (time: number | TimeAtModel | FieldValue) => {
  if (typeof time === "number") {
    return time;
  }

  if (time && typeof time === "object" && "seconds" in time) {
    return time.seconds * 1000 + time.nanoseconds / 1_000_000;
  }

  return 0;
};

export const getTimeMs = (time: any): number => {
  if (!time) return 0;

  // Firestore Timestamp instance
  if (typeof time.toMillis === "function") {
    return time.toMillis();
  }

  // Firestore Timestamp có toDate()
  if (typeof time.toDate === "function") {
    return time.toDate().getTime();
  }

  // Dạng { seconds, nanoseconds }
  if (
    typeof time === "object" &&
    "seconds" in time &&
    typeof time.seconds === "number"
  ) {
    return time.seconds * 1000 + (time.nanoseconds ?? 0) / 1_000_000;
  }

  // Date.now() hoặc timestamp number
  if (typeof time === "number") {
    return time;
  }

  // string date nếu có
  const parsed = new Date(time).getTime();

  return Number.isNaN(parsed) ? 0 : parsed;
};

export const getOnlineStatus = (status: any) => {
  if (!status) return "Chưa xác định";

  if (status.online === true) return "🟢 Đang online";

  if (!status.lastSeen) return "Chưa xác định";

  const lastSeen =
    typeof status.lastSeen === "number"
      ? status.lastSeen
      : status.lastSeen?.toDate
        ? status.lastSeen.toDate().getTime()
        : null;

  if (!lastSeen) return "Chưa xác định";

  const diff = Date.now() - lastSeen;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "⚪ Vừa offline";
  if (minutes < 60) return `⚪ Offline ${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `⚪ Offline ${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  return `⚪ Offline ${days} ngày trước`;
};

export const getOnlineTitleByRole = (
  status: any,
  teacherRole?: string,
  currentUserRole?: string,
) => {
  if (teacherRole === "admin" && currentUserRole !== "admin") {
    return status?.online ? "Đang online" : "Offline";
  }

  return getOnlineStatus(status);
};
