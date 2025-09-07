import { Link } from "react-router-dom";
import {
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";

export default function LoginScreen() {
  return (
    <SectionComponent
      styles={{
        padding: 100,
        background: colors.primary,
        display: "flex",
        flex: 1,
        height: sizes.height,
      }}
    >
      <RowComponent
        styles={{
          //   background: colors.primaryLight,
          // borderRadius: 10,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* ben trai */}
        <RowComponent
          styles={{
            height: "100%",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 32,
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
              text="Đăng nhập"
              size={sizes.title}
              styles={{ fontWeight: "bold" }}
            />
            <SpaceComponent height={20} />
            <div style={{ width: "100%" }}>
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleFormControlInput1"
              />
            </div>
            <SpaceComponent height={10} />
            <div style={{ width: "100%" }}>
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Mật khẩu
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleFormControlInput1"
              />
            </div>
            <SpaceComponent height={10} />
            <div
              className="form-check"
              style={{ width: "100%", margin: "10px 0" }}
            >
              <input
                onChange={() => {}}
                className="form-check-input"
                type="checkbox"
                value=""
                id={`flexCheckChecked`}
              />
              <label htmlFor={`flexCheckChecked`}> Ghi nhớ đăng nhập</label>
            </div>

            <button
              style={{
                width: "100%",
                background: colors.orange,
                borderColor: colors.orange,
                fontWeight: "bold",
              }}
              type="button"
              className="btn btn-primary"
            >
              Đăng nhập
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
              <Link to={"/forgotPassword"} style={{ textDecoration: "none" }}>
                <TextComponent text="Quên mật khẩu ?" size={sizes.bigText} />
              </Link>
              <Link to={"/register"} style={{ textDecoration: "none" }}>
                <TextComponent
                  text="Đăng ký tài khoản mới"
                  size={sizes.bigText}
                />
              </Link>
            </div>
          </RowComponent>
        </RowComponent>

        {/* ben phai */}
        <RowComponent
          styles={{
            height: "100%",
            width: "100%",
            justifyContent: "flex-start",
            alignItems:'flex-start',
          }}
        >
          <img
            src="teamhbmedu.jpg"
            alt=""
            style={{
              borderRadius: 10,
              objectFit:'contain',
              height: "100%",
              width: "100%",
            }}
          />
        </RowComponent>
      </RowComponent>
    </SectionComponent>
  );
}
