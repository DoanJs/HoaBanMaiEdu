import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { useState } from "react";
import LoadingOverlay from "../../components/LoadingOverLay";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { auth } from "../../firebase.config";
import "./changepassword.css";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const isDisable =
    !form.currentPassword || !form.confirmPassword || !form.newPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    // const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      alert("Không tìm thấy người dùng");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tạo credential từ mật khẩu hiện tại
      const credential = EmailAuthProvider.credential(
        user.email,
        form.currentPassword,
      );

      // 2. Re-authenticate
      await reauthenticateWithCredential(user, credential);

      // 3. Update password
      await updatePassword(user, form.newPassword);

      handleToastSuccess("Đổi mật khẩu thành công!");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/wrong-password") {
        handleToastError("Mật khẩu hiện tại không đúng");
      } else if (error.code === "auth/weak-password") {
        handleToastError("Mật khẩu mới quá yếu");
      } else {
        handleToastError("Có lỗi xảy ra, thử lại sau");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        {/* HEADER */}
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <h2 className="page-title fw-black text-green-dark mb-2">
              Đổi mật khẩu
            </h2>
            <p className="fs-6 text-green-muted mb-0">
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn.
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="row">
          <div className="col-12 col-lg-7 col-xl-5">
            <div className="plan-detail-panel p-3 p-md-4">
              <form onSubmit={handleSubmit}>
                {/* Current password */}
                <div className="mb-3">
                  <label className="form-label fw-bold text-green-dark">
                    Mật khẩu hiện tại
                  </label>
                  <div className="input-group custom-input">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                  </div>
                </div>

                {/* New password */}
                <div className="mb-3">
                  <label className="form-label fw-bold text-green-dark">
                    Mật khẩu mới
                  </label>
                  <div className="input-group custom-input">
                    <span className="input-group-text">
                      <i className="bi bi-shield-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                  </div>
                  <div className="small text-green-muted mt-1">
                    Ít nhất 8 ký tự, có chữ và số
                  </div>
                </div>

                {/* Confirm password */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-green-dark">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="input-group custom-input">
                    <span className="input-group-text">
                      <i className="bi bi-check-circle-fill"></i>
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="d-flex gap-2 justify-content-end flex-wrap">
                  <button
                    type="button"
                    className="btn action-btn-soft"
                    onClick={() =>
                      setForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      })
                    }
                  >
                    Huỷ
                  </button>

                  <button
                    type="submit"
                    className="btn action-btn-primary"
                    disabled={isDisable}
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <LoadingOverlay show={isLoading} />
    </>
  );
}
