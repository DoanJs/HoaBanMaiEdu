import { sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RowComponent, SectionComponent, SpaceComponent, SpinnerComponent, TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { handleToastError, handleToastSuccess } from "../../constants/handleToast";
import { sizes } from "../../constants/sizes";
import { validateEmail } from "../../constants/validateEmailPhone";
import { auth } from "../../firebase.config";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (email !== '' && validateEmail(email)) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [email])

  const handleResetPassword = () => {
    setIsLoading(false)
    try {
      sendPasswordResetEmail(auth, email).then(result => console.log(result))
      handleToastSuccess('Vui lòng kiểm tra email để reset lại mật khẩu !')
      setIsLoading(true)
      setEmail('')
    } catch (error) {
      handleToastError('Reset mật khẩu thất bại. Vui lòng liên hệ admin !')
      setIsLoading(false)
      setEmail('')
    }

    navigate('/login')
  }
  return (
    <SectionComponent
      styles={{
        padding: 100,
        background: colors.primary,
        display: "flex",
        flex: 1,
        height: sizes.height,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <RowComponent
        styles={{
          display: "flex",
          flexDirection: "column",
          background: colors.bacground,
          padding: 30,
          borderRadius: 10,
          height: "60%",
          width: "50%",
        }}
      >
        <TextComponent
          text="Quên mật khẩu "
          size={sizes.bigTitle}
          styles={{ fontWeight: "bold" }}
        />
        <SpaceComponent height={30} />
        <div style={{ width: "50%" }}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Email reset tài khoản:
          </label>
          <input
            placeholder="Nhập tài khoản email cô đã đăng ký"
            onChange={(val) =>
              setEmail(val.target.value)
            }
            type="email"
            className="form-control"
          />
        </div>

        <SpaceComponent height={20} />
        <button
          onClick={!disable ? handleResetPassword : undefined}
          style={{
            width: "50%",
            background: disable ? colors.gray : colors.orange,
            borderColor: disable ? colors.gray : colors.orange,
            fontWeight: "bold",
          }}
          type="button"
          className="btn btn-primary"
        >
          {isLoading ? <SpinnerComponent /> : <>Send email</>}
        </button>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px 0",
          }}
        >
          <Link to={"/login"} style={{ textDecoration: "none" }}>
            <TextComponent text="Đăng nhập" size={sizes.bigText} />
          </Link>
        </div>
      </RowComponent>
    </SectionComponent>
  );
}
