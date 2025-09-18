import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { useUserStore } from "../../zustand";
import { auth } from "../../firebase.config";
import LoadingOverlay from "../LoadingOverLay";
import { useState } from "react";
import { handleToastError, handleToastSuccess } from "../../constants/handleToast";

export default function ModalResetPassword() {
  const {user} = useUserStore()
const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true)
    try {
      sendPasswordResetEmail(auth, user?.email as string).then(result => console.log(result))
      handleToastSuccess('Kiểm tra emai để reset lại mật khẩu !')
      setIsLoading(false)
    } catch (error: any) {
      console.error(error);
      handleToastError('Reset mật khẩu thất bại. Vui lòng liên hệ admin !')
      setIsLoading(false)
    }
  };
  return (
    <div className="modal fade" id="resetPassword" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Đổi mật khẩu tài khoản</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
          Mật khẩu mới sẽ được reset lại trong email cô đã đăng ký ({user?.email}). 
          Cô chắc chắn muốn thay đổi mật khẩu cho tài khoản của mình ? 
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleResetPassword}>Thay đổi</button>
          </div>
        </div>
      </div>

      <LoadingOverlay show={isLoading} />
    </div>
  );
}
