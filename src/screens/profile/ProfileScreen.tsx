import { signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionComponent, SpinnerComponent } from "../../components";
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
    <SectionComponent styles={{ marginTop: 10 }}>
      <button type="button" className="btn btn-warning" onClick={handleLogout}>
        {isLoading ? <SpinnerComponent /> : <>Đăng xuất</>}
      </button>
    </SectionComponent>
  );
}
