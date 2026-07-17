import style from "./AuthenticationTitle.module.css";
import FormLogin from "./_login";

/**
 * Trang đăng nhập Tấn Phát ERP.
 *
 * Toàn bộ sơ đồ ERP (logo, vòng kết nối, module, hiệu ứng công nghệ) nằm sẵn
 * trong ẢNH NỀN full màn hình — không dựng lại bằng HTML để tránh trùng lặp.
 * Chỉ khối đăng nhập được đặt nổi trên vùng sáng bên phải của ảnh.
 *
 * ➜ Ảnh nền: public/trangdangnhap.jpg
 *   (nạp qua inline style của `.wrapper`; nếu thiếu, gradient xanh dự phòng
 *    sẽ hiển thị thay thế.)
 */
// Ảnh nền ERP + gradient dự phòng (nếu ảnh chưa có, gradient hiển thị thay thế).
const publicUrl = process.env.PUBLIC_URL || "";
const wrapperBg = {
  backgroundImage:
    `url("${publicUrl}/trangdangnhap-ai-logo-4k.jpg"), ` +
    "linear-gradient(105deg, #0a2f63 0%, #1454a3 42%, #cddcf6 70%, #f6f9fe 100%)",
};

const LayoutLogin = () => {
  return (
    <div className={style.wrapper}>
      {/* Layer ảnh nền riêng để chuyển động chậm (Ken Burns) mà không ảnh hưởng nội dung */}
      <div className={style.bgLayer} style={wrapperBg} aria-hidden="true" />
      {/* Lớp phủ xanh che ảnh ERP trên màn hình nhỏ */}
      <div className={style.mobileCover} aria-hidden="true" />
      {/* Lớp phủ xanh rất nhẹ mép trái giúp chi tiết ảnh rõ hơn */}
      <div className={style.leftWash} aria-hidden="true" />
      {/* Lớp sáng bên phải bảo đảm form luôn dễ đọc dù ảnh thay đổi */}
      <div className={style.rightWash} aria-hidden="true" />

      <section className={style.loginArea}>
        <span className={`${style.areaGlow} ${style.areaGlowA}`} aria-hidden="true" />
        <span className={`${style.areaGlow} ${style.areaGlowB}`} aria-hidden="true" />

        <div className={style.welcome}>
          <span className={style.eyebrow}>TẤN PHÁT ERP · ENTERPRISE PLATFORM</span>
          <h1 className={style.welcomeTitle}>Chào mừng trở lại</h1>
          <p className={style.welcomeSub}>
            Đăng nhập để tiếp tục quản lý và vận hành doanh nghiệp.
          </p>
        </div>

        <FormLogin />

        <footer className={style.pageFooter}>
          <p>Gặp vấn đề khi đăng nhập? Liên hệ quản trị hệ thống.</p>
          <p>© 2026 Tấn&nbsp;Phát&nbsp;ERP · Phiên&nbsp;bản 1.0.0</p>
        </footer>
      </section>
    </div>
  );
};

export default LayoutLogin;
