import { Link } from "react-router-dom";
import './notfound.css'

export default function NotFoundScreen() {
  return (
    <div className="home-shell">
      <main className="home-panel">
        <section className="content-area d-flex align-items-center justify-content-center">
          <div className="notfound-box text-center">
            <div className="notfound-icon">
              <i className="bi bi-signpost-split-fill" />
            </div>

            <div className="notfound-code">404</div>

            <h1 className="notfound-title">
              Không tìm thấy trang
            </h1>

            <p className="notfound-desc">
              Đường dẫn bạn đang truy cập không tồn tại hoặc đã được di chuyển.
            </p>

            <Link to="/" className="notfound-btn cursor-pointer">
              <i className="bi bi-house-door-fill me-2" />
              Quay về trang chủ
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}