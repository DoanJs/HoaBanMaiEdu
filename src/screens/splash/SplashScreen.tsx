import './splashscreen.css'
interface Props {
  progress: number;
  centerName: string;
}

export default function SplashScreen({
  progress,
  centerName,
}: Props) {
  return (
    <div className="splash-screen">
      <div className="container">

        <div className="row justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-5">

            <div className="text-center">

              {/* Logo */}

              <div className="splash-logo-wrapper">
                <img
                  src="/HBMEdu-icon-512x512.png"
                  alt="Logo"
                  className="img-fluid splash-logo mb-4"
                />
              </div>

              {/* Tên trung tâm */}
              <h1 className="splash-title">
                TRUNG TÂM CAN THIỆP SỚM
              </h1>
              <h1 className="splash-title">
                HOA BAN MAI EDU
              </h1>

              <p className="splash-subtitle">
                Tuy nhỏ bé nhưng tạo nên giá trị khác biệt phi thường
              </p>

              {/* Progress */}
              <div className="progress splash-progress">
                <div
                  className="progress-bar splash-progress-bar"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="d-flex justify-content-between mt-2 splash-info">
                <span>Đang tải dữ liệu...</span>
                <span>{progress}%</span>
              </div>

            </div>

          </div>
        </div>

      </div>

      <div className="splash-footer">
        Phiên bản 1.0.0
      </div>
    </div>
  );
}