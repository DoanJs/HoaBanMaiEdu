import { Link } from "react-router-dom";
import { FIRST_NAME, LAST_NAME } from "../constants/info";

export default function Logo({ type }: { type: string }) {
  return (
    <Link to={"/"} className="d-flex align-items-center text-decoration-none">
      {/* LOGO IMAGE */}
      <div className="brand-logo flex-shrink-0 me-2">
        <img
          src="/HBMEdu-icon-512x512.png" // hoặc import nếu dùng src folder
          alt="Logo"
          className="logo-img"
        />
      </div>

      {/* TEXT */}
      <div className="min-w-0 text-center">
        <div
          className={`${type === "children" || type === "login" || type === "register" || type === "forgotpassword" ? "brand-title" : "logo-title"} ${(type === "login" || type === "register" || type === "forgotpassword") && "text-white"}`}
        >
          {FIRST_NAME}
        </div>
        <div
          className={`text-center ${type === "children" || type === "login" || type === "register" || type === "forgotpassword" ? "brand-title" : "logo-title"} ${(type === "login" || type === "register" || type === "forgotpassword") && "text-white"}`}
        >
          {LAST_NAME}
        </div>
        {/* <div
          className={`${type === "children" || type === "login" || type === "register" || type === "forgotpassword" ? "brand-title" : "logo-title"} ${(type === "login" || type === "register" || type === "forgotpassword") && "text-white"}`}
        >
          {CENTER_NAME}
        </div> */}
      </div>
    </Link>
  );
}
