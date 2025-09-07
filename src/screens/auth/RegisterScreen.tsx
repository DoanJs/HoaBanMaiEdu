import { Link } from "react-router-dom";
import {
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";

export default function RegisterScreen() {
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
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        
        {/* ben trái */}
        <RowComponent
          styles={{
            height: "100%",
            width: "100%",
            justifyContent:'flex-end'
          }}
        >
          <img
            src="voi.jpg"
            alt=""
            style={{
              borderRadius: 10,
            }}
          />
        </RowComponent>

        {/* ben phải */}
        <RowComponent
          styles={{
            height: "100%",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: 32
          }}
        >
          <RowComponent
            styles={{
              display: "flex",
              flexDirection: "column",
              background: colors.bacground,
              padding: 30,
              borderRadius: 10,
              height: "70%",
              width: "50%",
            }}
          >
            <TextComponent
              text="Đăng ký"
              size={sizes.title}
              styles={{ fontWeight: "bold" }}
            />
            <SpaceComponent height={20} />
            <div style={{ width: "100%" }}>
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Họ và tên
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
            <div style={{ width: "100%" }}>
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Nhập lại mật khẩu
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleFormControlInput1"
              />
            </div>
            <SpaceComponent height={20} />

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
              Đăng ký
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
                <TextComponent
                  text="Đăng nhập"
                  size={sizes.bigText}
                />
              </Link>
            </div>
          </RowComponent>
        </RowComponent>

      </RowComponent>
    </SectionComponent>
  );
}
