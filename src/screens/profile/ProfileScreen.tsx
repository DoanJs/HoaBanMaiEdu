import { signOut } from "firebase/auth";
import { Logout, Repeat } from "iconsax-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ModalResetPassword,
  RowComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";
import { auth } from "../../firebase.config";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await signOut(auth);
      setIsLoading(false);
      navigate("/login", { replace: true }); // <-- chuyển hướng rõ ràng
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <SpaceComponent height={10} />
      <RowComponent justify="space-between">
        <div
          style={{
            display:'flex',
            cursor: "pointer",
          }}
          data-bs-toggle="modal"
          data-bs-target="#resetPassword"
        >
          {isLoading ? (
            <SpinnerComponent />
          ) : (
            <>
              <Repeat size={24} color="coral" variant="Bold" />
              <SpaceComponent width={6} />
              <TextComponent
                text="Đổi mật khẩu"
                size={sizes.bigText}
                color={colors.primary}
                styles={{ fontWeight: "bold" }}
              />
            </>
          )}
        </div>
        <RowComponent
          onClick={handleLogout}
          styles={{
            cursor: "pointer",
          }}
        >
          {isLoading ? (
            <SpinnerComponent />
          ) : (
            <>
              <Logout size={24} color="coral" variant="Bold" />
              <TextComponent
                text=" Đăng xuất"
                size={sizes.bigText}
                color={colors.primary}
                styles={{ fontWeight: "bold" }}
              />
            </>
          )}
        </RowComponent>
      </RowComponent>

      <ModalResetPassword />
    </div>
  );
}
