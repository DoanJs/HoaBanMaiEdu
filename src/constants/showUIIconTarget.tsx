export const showUIIconTarget = (title: string) => {
  let result: any;
  switch (title) {
    case "Ngôn ngữ hiểu":
      result = "ngonnguhieu.png";
      break;
    case "Ngôn ngữ diễn đạt":
      result = "ngonngudiendat.png";
      break;
    case "Nhận thức":
      result = "nhanthuc.png";
      break;
    case "Vận động tinh":
      result = "vandongtinh.png";
      break;
    case "Cá nhân xã hội":
      result = "canhanxahoi.png";
      break;
    case "Chỉnh âm":
      result = "chinham.png";
      break;
    case "Hành vi":
      result = "hanhvi.png";
      break;
    case "Tập trung chú ý":
      result = "taptrungchuy.png";
      break;
    default:
      result = "HBMEdu-icon-512x512.png";
      break;
  }
  return result;
};
