import { signOut } from "firebase/auth";
import { Logout, Repeat, ScanBarcode } from "iconsax-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ModalResetPassword,
  RowComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { auth } from "../../firebase.config";
import { useUserStore } from "../../zustand";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserStore()

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

  if (!user) return <SpinnerComponent />

  return (
    <div style={{ width: "100%", }}>
      <SpaceComponent height={10} />
      <RowComponent justify="space-between">
        <div
          style={{
            display: 'flex',
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
        {
          user.role === 'admin' &&
          <Link to={'../admin'} style={{
            textDecoration: "none",
            display: 'flex',
            cursor: "pointer",
          }}>
            <ScanBarcode size={24} variant="Bold" color="coral" />
            <SpaceComponent width={6} />
            <TextComponent
              text={'Trang quản trị'}
              size={widthSmall ? sizes.text : sizes.thinTitle}
              color={colors.primary}
              styles={{ fontWeight: "bold" }}
            />
          </Link>

        }
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
